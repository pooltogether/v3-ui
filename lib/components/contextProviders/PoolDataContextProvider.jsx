import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQueryCache } from 'react-query'
import { isEmpty } from 'lodash'

import { QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { ChainQueries } from 'lib/components/ChainQueries'
import { FetchUsersChainData } from 'lib/components/FetchUsersChainData'
import { GraphPoolDripQueries } from 'lib/components/queryComponents/GraphPoolDripQueries'
import { UniswapData } from 'lib/components/UniswapData'
import { usePoolsQuery } from 'lib/hooks/usePoolsQuery'
import { compilePools } from 'lib/services/compilePools'
import { getCurrentPool } from 'lib/services/getCurrentPool'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { readProvider } from 'lib/services/readProvider'
import { poolToast } from 'lib/utils/poolToast'

export const PoolDataContext = React.createContext()
const debug = require('debug')('pool-app:PoolDataContext')

export function PoolDataContextProvider(props) {
  const queryCache = useQueryCache()

  const {
    supportedNetwork,
    networkName,
    chainId,
    pauseQueries,
    usersAddress
  } = useContext(AuthControllerContext)

  const [defaultReadProvider, setDefaultReadProvider] = useState({})

  const router = useRouter()
  const querySymbol = router?.query?.symbol?.toLowerCase()

  useEffect(() => {
    const getReadProvider = async () => {
      const defaultReadProvider = await readProvider(networkName)
      setDefaultReadProvider(defaultReadProvider)
    }
    getReadProvider()
  }, [networkName])




  let contractAddresses
  try {
    if (supportedNetwork) {
      contractAddresses = getContractAddresses(chainId)
    }
  } catch (e) {
    poolToast.error(e)
    console.error(e)
  }


  const blockNumber = -1
  const {
    refetch: refetchPoolsData,
    data: poolsGraphData,
    error: poolsError,
    isFetching: poolsIsFetching,
  } = usePoolsQuery(pauseQueries, chainId, contractAddresses, blockNumber)

  if (poolsError) {
    poolToast.error(poolsError)
    console.error(poolsError)
  }

  const poolData = getPoolDataFromQueryResult(contractAddresses, poolsGraphData)

  const poolsDataLoading = !poolsGraphData

  if (!poolsIsFetching && !isEmpty(poolsGraphData)) {
    // this should obviously be moved out of the global window namespace :)
    window.hideGraphError()
  }

  return <>
    <ChainQueries
      {...props}
      chainId={chainId}
      provider={defaultReadProvider}
      poolData={poolData}
    >
      {({ genericChainData }) => {
        const pools = compilePools(chainId, contractAddresses, queryCache, poolData, genericChainData)

        const currentPool = getCurrentPool(querySymbol, pools)
        
        const ethereumErc20Awards = queryCache.getQueryData([
          QUERY_KEYS.ethereumErc20sQuery,
          chainId,
          poolData?.daiPool?.poolAddress,
          -1
        ])
        const addresses = ethereumErc20Awards
          ?.filter(award => award.balance.gt(0))
          ?.map(award => award.address)

        return <UniswapData
          addresses={addresses}
          poolAddress={poolData?.daiPool?.poolAddress}
        >
          {() => {
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
                  contractAddresses={contractAddresses}
                >
                  {({ usersChainData }) => {
                    return <PoolDataContext.Provider
                      value={{
                        loading: poolsDataLoading,
                        pool: currentPool,
                        pools,
                        contractAddresses,
                        defaultReadProvider,
                        genericChainData,
                        refetchPoolsData,
                        graphDripData,
                        usersChainData,
                      }}
                    >
                      {props.children}
                    </PoolDataContext.Provider>
                  }}
                </FetchUsersChainData>
              }}
            </GraphPoolDripQueries>
          }}
        </UniswapData>
      }}
    </ChainQueries>
  </>
}
