import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { CoingeckoData } from 'lib/components/CoingeckoData'
import { FetchGenericChainData } from 'lib/components/FetchGenericChainData'
import { FetchUsersChainData } from 'lib/components/FetchUsersChainData'
import { GraphDataQueries } from 'lib/components/queryComponents/GraphDataQueries'
import { GraphPoolDripQueries } from 'lib/components/queryComponents/GraphPoolDripQueries'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { calculateEstimatedPoolPrize } from 'lib/services/calculateEstimatedPoolPrize'
import { calculateEstimatedExternalAwardsValue } from 'lib/services/calculateEstimatedExternalAwardsValue'
import { calculateEstimatedExternalItemAwardsValue } from 'lib/services/calculateEstimatedExternalItemAwardsValue'
import { poolToast } from 'lib/utils/poolToast'
import { readProvider } from 'lib/utils/readProvider'

export const PoolDataContext = React.createContext()
const debug = require('debug')('pool-app:PoolDataContext')

export const PoolDataContextProvider = (props) => {
  const {
    supportedNetwork,
    networkName,
    chainId,
    usersAddress
  } = useContext(AuthControllerContext)

  const [defaultReadProvider, setDefaultReadProvider] = useState({})

  const router = useRouter()
  const querySymbol = router.query.symbol && router.query.symbol.toLowerCase()

  useEffect(() => {
    const getReadProvider = async () => {
      const defaultReadProvider = await readProvider(networkName)
      setDefaultReadProvider(defaultReadProvider)
    }
    getReadProvider()
  }, [networkName])

  let poolAddresses
  try {
    if (supportedNetwork) {
      poolAddresses = getContractAddresses(chainId)
    }
  } catch (e) {
    poolToast.error(e)
    console.error(e)
  }








  return <>
    <GraphDataQueries
      {...props}
      poolAddresses={poolAddresses}
      usersAddress={usersAddress}
    >
      {({
        graphDataLoading,
        dynamicExternalAwardsData,
        dynamicPoolData,
        dynamicPrizeStrategiesData,
        dynamicPlayerData,
        dynamicSponsorData,
        refetchPoolQuery,
        refetchPrizeStrategyQuery,
        refetchPlayerQuery,
        refetchSponsorQuery,
        dynamicPlayerDrips,
      }) => {
        return <>
          <CoingeckoData
            dynamicExternalAwardsData={dynamicExternalAwardsData}
          >
            {({ coingeckoData }) => {
              return <FetchGenericChainData
                {...props}
                coingeckoData={coingeckoData}
                chainId={chainId}
                provider={defaultReadProvider}
                dynamicExternalAwardsData={dynamicExternalAwardsData}
                poolData={dynamicPoolData}
                graphDataLoading={graphDataLoading}
              >
                {({ genericChainData, external20ChainData, external721ChainData }) => {
                  let pools = []

                  if (!graphDataLoading && !isEmpty(genericChainData)) {
                    const externalAwardsEstimate = calculateEstimatedExternalAwardsValue(
                      external20ChainData?.dai
                    )
                    const externalItemAwardsEstimate = calculateEstimatedExternalItemAwardsValue(
                      external721ChainData?.dai
                    )
                    const interestPrizeEstimate = calculateEstimatedPoolPrize({
                      ...genericChainData.dai,
                      ...dynamicPoolData.daiPool,
                      ...dynamicPrizeStrategiesData.daiPrizeStrategy,
                    })

                    const totalPrizeEstimate = externalAwardsEstimate ?
                      interestPrizeEstimate.add(ethers.utils.parseEther(
                        externalAwardsEstimate.toString()
                      )) :
                      interestPrizeEstimate

                    pools = [
                      {
                        name: 'DAI Pool',
                        frequency: 'Weekly',
                        symbol: 'PT-cDAI',
                        ...genericChainData.dai,
                        ...dynamicPoolData.daiPool,
                        ...dynamicPrizeStrategiesData.daiPrizeStrategy,
                        prizeEstimate: totalPrizeEstimate,
                        interestPrizeEstimate,
                        externalAwardsEstimate,
                        externalItemAwardsEstimate,
                        external20ChainData: external20ChainData.dai,
                        external721ChainData: external721ChainData.dai,
                      },
                      // {
                      //   name: 'Tether Pool',
                      // ...
                      // },
                    ]
                  }

                  let pool = null
                  if (querySymbol && pools?.length > 0) {
                    pool = pools.find(_pool => {
                      let symbol = _pool?.symbol?.toLowerCase()

                      return symbol === querySymbol
                    })
                  }

                  const poolAddress = pool?.poolAddress
                  const underlyingCollateralDecimals = pool?.underlyingCollateralDecimals

                  let usersTicketBalance = 0
                  let usersTicketBalanceBN = ethers.utils.bigNumberify(0)


                  if (pool && dynamicPlayerData) {
                    const player = dynamicPlayerData.find(data => data.prizePool.id === poolAddress)

                    if (player && underlyingCollateralDecimals) {
                      usersTicketBalance = ethers.utils.formatUnits(
                        player.balance,
                        underlyingCollateralDecimals
                      )
                      usersTicketBalanceBN = ethers.utils.bigNumberify(player.balance)
                    }
                  }

                  let usersSponsorshipBalance = 0
                  let usersSponsorshipBalanceBN = ethers.utils.bigNumberify(0)

                  if (pool && dynamicSponsorData) {
                    const sponsor = dynamicSponsorData.find(data => data.prizePool.id === poolAddress)

                    if (sponsor && underlyingCollateralDecimals) {
                      usersSponsorshipBalance = Number(ethers.utils.formatUnits(
                        sponsor.balance,
                        Number(underlyingCollateralDecimals)
                      ))
                      usersSponsorshipBalanceBN = ethers.utils.bigNumberify(sponsor.balance)
                    }
                  }


                  // TODO!
                  /// hard-coded to just the DAI pool for now since that's all we're gonna launch with
                  const daiPool = pools.find(_pool => _pool?.symbol === 'PT-cDAI')
                  return <GraphPoolDripQueries
                    pool={daiPool}
                  >
                    {({ dripDataLoading, graphDripData }) => {
                      return <FetchUsersChainData
                        {...props}
                        provider={defaultReadProvider}
                        pool={pool}
                        usersAddress={usersAddress}
                        graphDripData={graphDripData}
                        poolAddresses={poolAddresses}
                      >
                        {({ usersChainData }) => {
                          return <PoolDataContext.Provider
                            value={{
                              loading: graphDataLoading || dripDataLoading,
                              pool,
                              pools,
                              poolAddresses,
                              dynamicExternalAwardsData,
                              dynamicPoolData,
                              dynamicPlayerData,
                              dynamicPlayerDrips,
                              genericChainData,
                              refetchPoolQuery,
                              refetchPrizeStrategyQuery,
                              refetchPlayerQuery,
                              refetchSponsorQuery,
                              graphDripData,
                              usersChainData,
                              usersSponsorshipBalance,
                              usersSponsorshipBalanceBN,
                              usersTicketBalance,
                              usersTicketBalanceBN,
                            }}
                          >
                            {props.children}
                          </PoolDataContext.Provider>


                        }}
                      </FetchUsersChainData>
                    }}
                  </GraphPoolDripQueries>
                }}
              </FetchGenericChainData>
            }}
          </CoingeckoData>

          
        </>
      }}
    </GraphDataQueries>
  </>
}
