import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'
import { useQuery } from '@apollo/client'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { CoingeckoQuery } from 'lib/components/CoingeckoQuery'
import { FetchGenericChainData } from 'lib/components/FetchGenericChainData'
import { FetchUsersChainData } from 'lib/components/FetchUsersChainData'
import { GraphDataQueries } from 'lib/components/queryComponents/GraphDataQueries'
import { GraphPoolDripQueries } from 'lib/components/queryComponents/GraphPoolDripQueries'
import { coingeckoQuery } from 'lib/queries/coingeckoQueries'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { calculateEstimatedPoolPrize } from 'lib/services/calculateEstimatedPoolPrize'
import { calculateEstimatedExternalAwards } from 'lib/services/calculateEstimatedExternalAwards'
import { poolToast } from 'lib/utils/poolToast'
import { readProvider } from 'lib/utils/readProvider'

export const PoolDataContext = React.createContext()

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

  const coingeckoQueryResult = useQuery(coingeckoQuery)
  const coingeckoData = coingeckoQueryResult?.data?.coingeckoData

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
          <CoingeckoQuery
            externalAwards={dynamicExternalAwardsData}
          />

          <FetchGenericChainData
            {...props}
            chainId={chainId}
            provider={defaultReadProvider}
            dynamicExternalAwardsData={dynamicExternalAwardsData}
            poolData={dynamicPoolData}
            graphDataLoading={graphDataLoading}
          >
            {({ genericChainData }) => {
              let pools = []

              if (!graphDataLoading && !isEmpty(genericChainData)) {
                console.log({ coingeckoData})
                const externalAwardsEstimate = calculateEstimatedExternalAwards(
                  coingeckoData,
                  genericChainData.dai.externalErc20AwardsChainData
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
                    externalErc20Awards: genericChainData.dai.externalErc20AwardsChainData,
                    prizeEstimate: totalPrizeEstimate,
                    interestPrizeEstimate,
                    externalAwardsEstimate,
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
        </>
      }}
    </GraphDataQueries>
  </>
}
