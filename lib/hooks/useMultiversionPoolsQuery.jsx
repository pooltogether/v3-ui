import { useContext } from 'react'

import { POOLS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { usePoolsQuery } from 'lib/hooks/usePoolsQuery'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { poolToast } from 'lib/utils/poolToast'

export function useMultiversionPoolsQuery() {
  const { chainId } = useContext(AuthControllerContext)

  const { contractAddresses } = useContractAddresses()
  const poolAddresses = contractAddresses?.pools

  // 3.1.0
  let {
    refetch: pools310Refetch,
    data: pools310GraphData,
    error: pools310Error,
    isFetched: pools310IsFetched
  } = usePoolsQuery(poolAddresses, '3.1.0')

  if (pools310Error) {
    poolToast.error(pools310Error)
    console.error(pools310Error)
  }

  pools310GraphData = getPoolDataFromQueryResult(
    chainId,
    contractAddresses,
    '3.1.0',
    pools310GraphData
  )

  // 3.3.2
  let {
    refetch: pools332Refetch,
    data: pools332GraphData,
    error: pools332Error,
    isFetched: pools332IsFetched
  } = usePoolsQuery(poolAddresses, '3.3.2')

  if (pools332Error) {
    poolToast.error(pools332Error)
    console.error(pools332Error)
  }

  pools332GraphData = getPoolDataFromQueryResult(
    chainId,
    contractAddresses,
    '3.3.2',
    pools332GraphData
  )

  // All Versions Combined
  const poolsDataLoading = !pools310IsFetched || !pools332IsFetched

  const poolsGraphData = {
    ...pools310GraphData,
    ...pools332GraphData
  }

  let pools310 = []
  let pools332 = []
  let pools = []

  const _compile = (array, POOL) => {
    const _pool = {
      ...POOL,
      ...poolsGraphData[POOL.symbol],
      id: contractAddresses[POOL.symbol]
    }

    if (_pool?.id) {
      array.push(_pool)
    }

    return array
  }

  if (contractAddresses && POOLS[chainId]) {
    pools310 = POOLS[chainId]['3.1.0'].reduce(_compile, [])
    pools332 = POOLS[chainId]['3.3.2'].reduce(_compile, [])
    pools = [...pools310, ...pools332]
  }

  const poolsRefetch = () => {
    pools310Refetch()
    pools332Refetch()
  }

  return {
    pools,
    poolsDataLoading,
    poolsRefetch,
    poolsGraphData
  }
}
