import { useCommunityPools } from 'lib/hooks/useCommunityPools'
import { useGovernancePools } from 'lib/hooks/useGovernancePools'

export function usePools() {
  const { poolsDataLoading, pools, refetchPoolsData, poolsGraphData } = useGovernancePools()
  const { communityPoolsGraphData: communityPools } = useCommunityPools()

  console.log(communityPools)
  return {
    pools,
    communityPools,
    loading: poolsDataLoading,
    refetchPoolsData,
    poolsGraphData,
  }
}
