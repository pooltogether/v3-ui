import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQueryCache } from 'react-query'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { ChainQueries } from 'lib/components/ChainQueries'
import { FetchUsersChainData } from 'lib/components/FetchUsersChainData'
import { GraphDataQueries } from 'lib/components/queryComponents/GraphDataQueries'
import { GraphPoolDripQueries } from 'lib/components/queryComponents/GraphPoolDripQueries'
import { UniswapData } from 'lib/components/UniswapData'
import { compilePools } from 'lib/services/compilePools'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { getCurrentPool } from 'lib/services/getCurrentPool'
import { getUsersSponsorshipBalance } from 'lib/services/getUsersSponsorshipBalance'
import { getUsersTicketBalance } from 'lib/services/getUsersTicketBalance'
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
                const pools = compilePools(poolAddresses, cache, poolData, graphDataLoading, genericChainData)

                const currentPool = getCurrentPool(querySymbol, pools)
                
                const {
                  usersTicketBalance,
                  usersTicketBalanceBN
                } = getUsersTicketBalance(currentPool, dynamicPlayerData)

                const {
                  usersSponsorshipBalance,
                  usersSponsorshipBalanceBN
                } = getUsersSponsorshipBalance(currentPool, dynamicPlayerData)



                return <GraphPoolDripQueries
                  pools={pools}
                >
                  {({ dripDataLoading, graphDripData }) => {
                    return <FetchUsersChainData
                      {...props}
                      provider={defaultReadProvider}
                      pool={currentPool}
                      usersAddress={usersAddress}
                      graphDripData={graphDripData}
                      poolAddresses={poolAddresses}
                    >
                      {({ usersChainData }) => {
                        return <PoolDataContext.Provider
                          value={{
                            loading: graphDataLoading || dripDataLoading,
                            // coingeckoData,
                            pool: currentPool,
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
