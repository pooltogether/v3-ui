import { useContext } from 'react'
import { isEmpty } from 'lodash'

import { POOLS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { usePoolsQuery } from 'lib/hooks/usePoolsQuery'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { poolToast } from 'lib/utils/poolToast'

export function useGovernancePools () {
  const { chainId } = useContext(AuthControllerContext)

  const { contractAddresses } = useContractAddresses()

  const blockNumber = -1
  const poolAddresses = contractAddresses?.pools
  let { refetch: poolsRefetch, data: poolsGraphData, error, isFetched } = usePoolsQuery(
    poolAddresses,
    blockNumber
  )

  if (error) {
    poolToast.error(error)
    console.error(error)
  }

  poolsGraphData = getPoolDataFromQueryResult(chainId, contractAddresses, poolsGraphData)

  const poolsDataLoading = !isFetched

  let pools = []

  if (contractAddresses && POOLS[chainId]) {
    POOLS[chainId].forEach((POOL) => {
      const _pool = {
        ...POOL,
        ...poolsGraphData[POOL.symbol],
        id: contractAddresses[POOL.symbol]
      }

      if (_pool?.id) {
        pools.push(_pool)
      }
    })
  }

  return {
    pools,
    poolsDataLoading,
    poolsRefetch,
    poolsGraphData
  }
}
