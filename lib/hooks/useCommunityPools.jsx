import { useContext } from 'react'

import { POOLS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useCommunityPoolAddresses } from 'lib/hooks/useCommunityPoolAddresses'
import { useCommunityPoolsQuery } from 'lib/hooks/useCommunityPoolsQuery'
import { poolToast } from 'lib/utils/poolToast'

export function useCommunityPools() {
  const { chainId } = useContext(AuthControllerContext)

  const { communityPoolAddresses } = useCommunityPoolAddresses()

  const poolAddresses = communityPoolAddresses
  let {
    refetch: refetchPoolsData,
    data: communityPoolsGraphData,
    error: poolsError,
  } = useCommunityPoolsQuery(poolAddresses)

  if (poolsError) {
    poolToast.error(poolsError)
    console.error(poolsError)
  }

  communityPoolsGraphData = communityPoolsGraphData.map(pool => {
    let newPool = Object.assign({}, pool)
    newPool.isCommunityPool = true

    return newPool
  })

  // console.log(communityPoolsGraphData)

  // communityPoolsGraphData = getPoolDataFromQueryResult(chainId, communityPoolAddresses, communityPoolsGraphData)

  const communityPoolsDataLoading = !communityPoolsGraphData

  return {
    communityPoolsDataLoading,
    // contractAddresses,
    refetchPoolsData,
    communityPoolsGraphData,
  }
}
