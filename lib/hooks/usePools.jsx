import { useContext } from 'react'
import { isEmpty } from 'lodash'

import { POOLS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePoolChainQuery } from 'lib/hooks/usePoolChainQuery'
import { usePoolsQuery } from 'lib/hooks/usePoolsQuery'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { poolToast } from 'lib/utils/poolToast'

export function usePools(props) {
  // const queryCache = useQueryCache()
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


  // const { poolChainData } = usePoolChainQuery(poolsGraphData)
  // console.log(poolChainData)
  // console.log(poolsGraphData)
  // const { erc20ChainData } = useErc20ChainQuery(poolsGraphData)
  // const { erc721ChainData } = useErc721ChainQuery(poolsGraphData)
  

  let pools = []
  POOLS.forEach(POOL => {
    const _pool = {
      ...POOL,
      id: contractAddresses[POOL.symbol],
    }

    // const _pool = compilePool(
    //   chainId,
    //   POOL,
    //   contractAddresses.daiPool,
    //   queryCache,
    //   poolChainData.dai,
    //   graphPoolData.daiPool,
    // )

    if (_pool?.id) {
      pools.push(_pool)
    }
  })

  // let pools = []
  // POOLS.forEach(POOL => {
  //   const _pool = compilePool(
  //     chainId,
  //     POOL,
  //     contractAddresses.daiPool,
  //     queryCache,
  //     poolChainData.dai,
  //     graphPoolData.daiPool,
  //   )

  //   if (_pool?.id) {
  //     pools.push(_pool)
  //   }
  // })

  // const pools = compilePools(chainId, contractAddresses, queryCache, poolsGraphData, poolChainData)

  // const { usersChainData } = useUsersChainData(pool)

  return {
    pools,
    loading: poolsDataLoading,
    contractAddresses,
    // poolChainData,
    refetchPoolsData,
    // graphDripData,
    poolsGraphData,
    // usersChainData,
  }
}
