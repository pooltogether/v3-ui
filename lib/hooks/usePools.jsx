import { useMemo } from 'react'

import { useCommunityPools } from 'lib/hooks/useCommunityPools'
import { useMultiversionGovernancePools } from 'lib/hooks/useMultiversionGovernancePools'

export function usePools() {
  const { pools, poolsDataLoading, poolsRefetch, poolsGraphData } = useMultiversionGovernancePools()
  const {
    communityPools,
    communityPoolsDataLoading,
    communityRefetch,
    communityPoolsGraphData
  } = useCommunityPools()

  const allPools = useMemo(() => {
    return {
      pools,
      poolsDataLoading,
      poolsRefetch,
      poolsGraphData,

      communityPools,
      communityPoolsDataLoading,
      communityRefetch,
      communityPoolsGraphData
    }
  }, [pools, communityPools, poolsGraphData, communityPoolsGraphData])

  return allPools
}
