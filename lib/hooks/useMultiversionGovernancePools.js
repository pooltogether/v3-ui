import { useContext, useMemo } from 'react'

import { POOLS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { useGovernancePoolsQuery } from 'lib/hooks/useGovernancePoolsQuery'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { poolToast } from 'lib/utils/poolToast'

export function useMultiversionGovernancePools() {
  const { chainId } = useContext(AuthControllerContext)

  const { contractAddresses } = useContractAddresses()
  const poolAddresses = contractAddresses?.pools

  // 3.1.0
  const version310 = '3.1.0'
  let {
    refetch: pools310Refetch,
    data: pools310GraphData,
    error: pools310Error,
    isFetched: pools310IsFetched
  } = useGovernancePoolsQuery(poolAddresses, version310)

  if (pools310Error) {
    poolToast.error(pools310Error)
    console.error(pools310Error)
  }

  // console.log(
  //   'Governance',
  //   pools310GraphData.map((g) => `${g.id}: ${g.version}`)
  // )

  pools310GraphData = getPoolDataFromQueryResult(
    chainId,
    contractAddresses,
    version310,
    pools310GraphData
  )

  // 3.3.2
  const version332 = '3.3.2'
  let {
    refetch: pools332Refetch,
    data: pools332GraphData,
    error: pools332Error,
    isFetched: pools332IsFetched
  } = useGovernancePoolsQuery(poolAddresses, version332)

  if (pools332Error) {
    poolToast.error(pools332Error)
    console.error(pools332Error)
  }

  // console.log(
  //   'Governance',
  //   pools332GraphData.map((g) => `${g.id}: ${g.version}`)
  // )

  pools332GraphData = getPoolDataFromQueryResult(
    chainId,
    contractAddresses,
    version332,
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
    pools310 = POOLS[chainId]?.['3.1.0']?.reduce(_compile, [])
    pools332 = POOLS[chainId]?.['3.3.2']?.reduce(_compile, [])
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
