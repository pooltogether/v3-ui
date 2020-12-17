import { useContext } from 'react'
// import { useRouter } from 'next/router'
import { useQueryCache } from 'react-query'

import { POOLS, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useChainQueries } from 'lib/hooks/useChainQueries'
import { usePools } from 'lib/hooks/usePools'
import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'
import { compilePool } from 'lib/services/compilePool'

export function usePool(poolSymbol, blockNumber = -1) {
  const queryCache = useQueryCache()

  // const router = useRouter()

  const { chainId } = useContext(AuthControllerContext)

  // TODO: Change this from returning poolsChainData, poolAddresses and poolsGraphData about every pool?
  const { contractAddresses, pools, poolsGraphData } = usePools()
  const { poolsChainData } = useChainQueries(poolsGraphData)

  console.log(poolsChainData)
  console.log(
    poolsChainData?.dai,
    poolsGraphData?.daiPool,
  )

  // const { contractAddresses } = usePools()
  
  // this router.query doesn't work inside a hook?
  // if (!poolSymbol) {
  //   poolSymbol = router?.query?.symbol
  // }

  // TODO: This is hard-coded to the DAI pool and will need to be changed
  const ethereumErc20Awards = queryCache.getQueryData([
    QUERY_KEYS.ethereumErc20sQuery,
    chainId,
    pools?.daiPool?.poolAddress,
    -1
  ])
  const addresses = ethereumErc20Awards
    ?.filter(award => award.balance.gt(0))
    ?.map(award => award.address)

  // this sets the data in the cache which we can pull out later with `getQueryData()`
  useUniswapTokensQuery(
    addresses,
    blockNumber
  )



  const poolInfo = POOLS.find(POOL => {
    return POOL.symbol === poolSymbol
  })

  const pool = compilePool(
    chainId,
    poolInfo,
    contractAddresses.daiPool,
    queryCache,
    poolsChainData?.dai,
    poolsGraphData?.daiPool,
  )

  return {
    pool
  }

  //       const pools = compilePools(chainId, contractAddresses, queryCache, poolData, poolsChainData)

  //       const currentPool = getCurrentPool(querySymbol, pools)
        
  //       return <FetchUsersChainData
  //         {...props}
  //         provider={defaultReadProvider}
  //         pool={currentPool}
  //         usersAddress={usersAddress}
  //         graphDripData={graphDripData}
  //         contractAddresses={contractAddresses}
  //       >
  //         {({ usersChainData }) => {
  //           return <PoolDataContext.Provider
  //             value={{
  //               loading: poolsDataLoading,
  //               pool: currentPool,
  //               pools,
  //               contractAddresses,
  //               defaultReadProvider,
  //               poolsChainData,
  //               refetchPoolsData,
  //               graphDripData,
  //               usersChainData,
  //             }}
  //           >
  //             {props.children}
  //           </PoolDataContext.Provider>
  //         }}
  //       </FetchUsersChainData>
  // </>
}
