import { useContext } from 'react'
import { isEmpty } from 'lodash'

import { POOLS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { usePoolsQuery } from 'lib/hooks/usePoolsQuery'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { poolToast } from 'lib/utils/poolToast'

export function useGovernancePools() {
  const { chainId } = useContext(AuthControllerContext)

  const { contractAddresses } = useContractAddresses()  

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

  poolsGraphData = getPoolDataFromQueryResult(chainId, contractAddresses, poolsGraphData)

  const poolsDataLoading = !poolsGraphData

  if (!poolsIsFetching && !isEmpty(poolsGraphData)) {
    // this should obviously be moved out of the global window namespace :)
    window.hideGraphError()
  }

  let pools = []

  if (contractAddresses && POOLS[chainId]) {
    POOLS[chainId].forEach((POOL) => {
      const _pool = {
        ...POOL,
        id: contractAddresses[POOL.symbol],
      }

      if (_pool?.id) {
        pools.push(_pool)
      }
    })
  }

  return {
    pools,
    poolsDataLoading,
    contractAddresses,
    refetchPoolsData,
    poolsGraphData,
  }
}
