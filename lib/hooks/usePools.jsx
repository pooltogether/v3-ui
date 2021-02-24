import { useCommunityPools } from 'lib/hooks/useCommunityPools'
import { useGovernancePools } from 'lib/hooks/useGovernancePools'

export function usePools() {
  const { poolsDataLoading, pools, refetchPoolsData, poolsGraphData } = useGovernancePools()
  const {
    isLoading: communityPoolsDataLoading,
    communityPools,
    communityRefetch,
    communityPoolsGraphData
  } = useCommunityPools()

  return {
    pools,
    loading: poolsDataLoading,
    refetchPoolsData,
    poolsGraphData,

    communityPools,
    communityPoolsDataLoading,
    communityRefetch,
    communityPoolsGraphData,
  }
}
