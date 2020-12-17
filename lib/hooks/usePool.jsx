import { useContext } from 'react'
// import { useRouter } from 'next/router'
import { useQueryCache } from 'react-query'

import { POOLS, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePoolChainQuery } from 'lib/hooks/usePoolChainQuery'
import { useErc20ChainQuery } from 'lib/hooks/useErc20ChainQuery'
import { useErc721ChainQuery } from 'lib/hooks/useErc721ChainQuery'
import { usePools } from 'lib/hooks/usePools'
import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'
import { compilePool } from 'lib/services/compilePool'

export function usePool(poolSymbol, blockNumber = -1) {
  const queryCache = useQueryCache()

  // const router = useRouter()

  const { chainId } = useContext(AuthControllerContext)

  // TODO: Change this from returning poolChainData, poolAddresses and poolsGraphData about every pool
  const { contractAddresses, pools, poolsGraphData } = usePools()

  // TODO: Change this from returning poolChainData, poolAddresses and poolsGraphData about every pool
  const { poolChainData } = usePoolChainQuery(poolsGraphData)
  const { erc20ChainData } = useErc20ChainQuery(poolsGraphData)
  const { erc721ChainData } = useErc721ChainQuery(poolsGraphData)

  console.log({ erc20ChainData })
  console.log({ erc721ChainData })

  // const { contractAddresses } = usePools()
  
  // this router.query doesn't work inside a hook?
  // if (!poolSymbol) {
  //   poolSymbol = router?.query?.symbol
  // }

  // TODO: This is hard-coded to the DAI pool and will need to be changed

  
  // const ethereumErc20Awards = queryCache.getQueryData([
  //   QUERY_KEYS.ethereumErc20sQuery,
  //   chainId,
  //   pools?.daiPool?.poolAddress,
  //   -1
  // ])
  const addresses = ethereumErc20Awards
    ?.filter(award => award.balance.gt(0))
    ?.map(award => award.address)

  console.log(ethereumErc20Awards)
  console.log(addresses)

  const { data: uniswapPriceData } = useUniswapTokensQuery(
    addresses,
    blockNumber
  )

  // const uniswapPriceData = queryCache.getQueryData([
  //   QUERY_KEYS.uniswapTokensQuery,
  //   chainId,
  //   !isEmpty(addresses) ? addresses.join('-') : '',
  //   -1
  // ])



  const poolInfo = POOLS.find(POOL => {
    return POOL.symbol === poolSymbol
  })

  const pool = compilePool(
    chainId,
    poolInfo,
    contractAddresses.daiPool,
    queryCache,
    poolChainData?.dai,
    poolsGraphData?.daiPool,
    uniswapPriceData,
  )

  return {
    pool
  }

  //       const pools = compilePools(chainId, contractAddresses, queryCache, poolData, poolChainData)

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
  //               poolChainData,
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
