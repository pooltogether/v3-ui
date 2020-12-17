import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQueryCache } from 'react-query'
import { isEmpty } from 'lodash'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePoolChainQuery } from 'lib/hooks/usePoolChainQuery'
import { usePoolsQuery } from 'lib/hooks/usePoolsQuery'
import { compilePools } from 'lib/services/compilePools'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { poolToast } from 'lib/utils/poolToast'

export function usePools(props) {
  const queryCache = useQueryCache()

  const { supportedNetwork, chainId } = useContext(AuthControllerContext)


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
  const poolAddresses = contractAddresses?.pools
  let {
    refetch: refetchPoolsData,
    data: poolsGraphData,
    error: poolsError,
    isFetching: poolsIsFetching,
  } = usePoolsQuery(poolAddresses, blockNumber)

  if (poolsError) {
    poolToast.error(poolsError)
    console.error(poolsError)
  }

  poolsGraphData = getPoolDataFromQueryResult(contractAddresses, poolsGraphData)





  



  const poolsDataLoading = !poolsGraphData

  if (!poolsIsFetching && !isEmpty(poolsGraphData)) {
    // this should obviously be moved out of the global window namespace :)
    window.hideGraphError()
  }


  const { poolChainData } = usePoolChainQuery(poolsGraphData)
  console.log(poolChainData)
  // const { erc20ChainData } = useErc20ChainQuery(poolsGraphData)
  // const { erc721ChainData } = useErc721ChainQuery(poolsGraphData)
  
  const pools = compilePools(chainId, contractAddresses, queryCache, poolsGraphData, poolChainData)

  // const { usersChainData } = useUsersChainData(pool)

  return {
    loading: poolsDataLoading,
    pools,
    contractAddresses,
    poolChainData,
    refetchPoolsData,
    // graphDripData,
    poolsGraphData,
    // usersChainData,
  }

  // return <>
  //   <ChainQueries
  //     {...props}
  //     chainId={chainId}
  //     provider={defaultReadProvider}
  //     poolData={poolData}
  //   >
  //     {({ poolChainData }) => {
        
  //       const currentPool = getCurrentPool(querySymbol, pools)
        
  //       // const ethereumErc20Awards = queryCache.getQueryData([
  //       //   QUERY_KEYS.ethereumErc20sQuery,
  //       //   chainId,
  //       //   poolData?.daiPool?.poolAddress,
  //       //   -1
  //       // ])
  //       // const addresses = ethereumErc20Awards
  //       //   ?.filter(award => award.balance.gt(0))
  //       //   ?.map(award => award.address)

        
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
  //               poolsGraphData,
  //               usersChainData,
  //             }}
  //           >
  //             {props.children}
  //           </PoolDataContext.Provider>
  //         }}
  //       </FetchUsersChainData>
  //     }}
  //   </ChainQueries>
  // </>
}
