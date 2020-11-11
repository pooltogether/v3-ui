import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'
import { useQueryCache } from 'react-query'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { ChainQueries } from 'lib/components/ChainQueries'
import { FetchUsersChainData } from 'lib/components/FetchUsersChainData'
import { GraphDataQueries } from 'lib/components/queryComponents/GraphDataQueries'
import { GraphPoolDripQueries } from 'lib/components/queryComponents/GraphPoolDripQueries'
import { UniswapData } from 'lib/components/UniswapData'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { compilePoolData } from 'lib/services/compilePoolData'
import { poolToast } from 'lib/utils/poolToast'
import { readProvider } from 'lib/utils/readProvider'

export const PoolDataContext = React.createContext()
const debug = require('debug')('pool-app:PoolDataContext')

export function PoolDataContextProvider(props) {
  const {
    supportedNetwork,
    networkName,
    chainId,
    usersAddress
  } = useContext(AuthControllerContext)

  const cache = useQueryCache()

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
        // dynamicExternalAwardsData,
        poolData,
        // dynamicPrizeStrategiesData,
        dynamicPlayerData,
        dynamicSponsorData,
        refetchPoolQuery,
        // refetchPrizeStrategyQuery,
        refetchPlayerQuery,
        refetchSponsorQuery,
        dynamicPlayerDrips,
      }) => {
        const addresses = poolData?.daiPool?.prizeStrategy?.externalErc20Awards?.map(award => award.address)

        return <UniswapData
          addresses={addresses}
          poolAddress={poolData?.daiPool?.poolAddress}
          poolData={poolData}
        >
          {() => {
            return <ChainQueries
              {...props}
              // coingeckoData={coingeckoData}
              cache={cache}
              chainId={chainId}
              provider={defaultReadProvider}
              // dynamicExternalAwardsData={dynamicExternalAwardsData}
              poolData={poolData}
              graphDataLoading={graphDataLoading}
            >
              {({ genericChainData }) => {
                let pools = []

                if (!graphDataLoading && !isEmpty(genericChainData)) {
                  const DAI_POOL_INFO = {
                    name: 'DAI Pool',
                    frequency: 'Weekly',
                    symbol: 'PT-cDAI'
                  }
                  const daiPool = compilePoolData(
                    DAI_POOL_INFO,
                    poolAddresses.daiPool,
                    cache,
                    genericChainData.dai,
                    poolData.daiPool,
                    // dynamicPrizeStrategiesData.daiPrizeStrategy,
                  )

                  pools = [
                    daiPool,
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
                            // coingeckoData,
                            pool,
                            pools,
                            poolAddresses,
                            defaultReadProvider,
                            // dynamicExternalAwardsData,
                            poolData,
                            dynamicPlayerData,
                            dynamicPlayerDrips,
                            genericChainData,
                            refetchPoolQuery,
                            // refetchPrizeStrategyQuery,
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
            </ChainQueries>
          }}
        </UniswapData>
      }}
    </GraphDataQueries>
  </>
}
