import { useContext, useMemo } from 'react'

import { POOLS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { useMultiversionPoolsQuery } from 'lib/hooks/useMultiversionPoolsQuery'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { poolToast } from 'lib/utils/poolToast'

export function useGovernancePools() {
  const { chainId } = useContext(AuthControllerContext)

  const { contractAddresses } = useContractAddresses()

  let { pools, poolsDataLoading, poolsRefetch, poolsGraphData } = useMultiversionPoolsQuery()
  console.log(poolsGraphData)

  return {
    pools,
    poolsDataLoading,
    poolsRefetch,
    poolsGraphData
  }

  // poolsGraphData = getPoolDataFromQueryResult(chainId, contractAddresses, '3.1.0', poolsGraphData)
  // poolsGraphData = useMemo(
  //   () => getPoolDataFromQueryResult(chainId, contractAddresses, poolsGraphData),
  //   [chainId, contractAddresses, poolsGraphData]
  // )

  // const poolsDataLoading = !isFetched

  // let pools = []

  // if (contractAddresses && POOLS[chainId]) {
  //   POOLS[chainId].forEach((POOL) => {
  //     const _pool = {
  //       ...POOL,
  //       ...poolsGraphData[POOL.symbol],
  //       id: contractAddresses[POOL.symbol]
  //     }

  //     if (_pool?.id) {
  //       pools.push(_pool)
  //     }
  //   })
  // }

  // return {
  //   pools,
  //   poolsDataLoading,
  //   poolsRefetch,
  //   poolsGraphData
  // }
}
