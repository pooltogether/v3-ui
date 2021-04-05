import { useMemo } from 'react'

import { useMultiversionCommunityPools } from 'lib/hooks/useMultiversionCommunityPools'
import { useMultiversionGovernancePools } from 'lib/hooks/useMultiversionGovernancePools'

export function usePools_OLD() {
  const { pools, poolsDataLoading, poolsRefetch, poolsGraphData } = useMultiversionGovernancePools()
  const {
    communityPools,
    communityPoolsDataLoading,
    communityRefetch,
    communityPoolsGraphData
  } = useMultiversionCommunityPools()

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
