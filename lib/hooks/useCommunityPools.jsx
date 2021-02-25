import { useMemo } from 'react'

import { useCommunityPoolAddresses } from 'lib/hooks/useCommunityPoolAddresses'
import { useCommunityPoolsQuery } from 'lib/hooks/useCommunityPoolsQuery'
import { marshallPoolData } from 'lib/services/marshallPoolData'
import { poolToast } from 'lib/utils/poolToast'
import { usePool } from 'lib/hooks/usePool'

export function useCommunityPools() {
  const { communityPoolAddresses } = useCommunityPoolAddresses()

  let communityPools = []

  const poolAddresses = communityPoolAddresses
  let {
    refetch: communityRefetch,
    data: communityPoolsGraphData,
    error: poolsError,
  } = useCommunityPoolsQuery(poolAddresses)

  if (poolsError) {
    poolToast.error(poolsError)
    console.error(poolsError)
  }

  // communityPoolsGraphData = useMemo(() => {
  //   return _initializeCommunityPoolData(communityPoolsGraphData)
  // }, [communityPoolsGraphData])
  communityPoolsGraphData = _initializeCommunityPoolData(communityPoolsGraphData)

  // Make an array out of it for ease of use
  communityPools = useMemo(() => {
    if (communityPoolsGraphData) {
      const keys = Object.keys(communityPoolsGraphData)
      return keys?.map(key => {
        return communityPoolsGraphData[key]
      })
    }
  }, [communityPoolsGraphData])

  const communityPoolsDataLoading = !communityPoolsGraphData

  return {
    communityPools,
    communityPoolsDataLoading,
    communityRefetch,
    communityPoolsGraphData,
  }
}

const _initializeCommunityPoolData = (communityPoolsGraphData = []) => {
  let poolData = {}

  communityPoolsGraphData.forEach((poolGraphData) => {
    const marshalledData = marshallPoolData(poolGraphData)

    let newPool = Object.assign({}, poolGraphData)
    newPool.isCommunityPool = true
    newPool.name = `${poolGraphData.underlyingCollateralSymbol} Community Pool`
    newPool.symbol = `${poolGraphData.underlyingCollateralSymbol}-${poolGraphData.id.substr(0, 8)}`

    poolData[newPool.symbol] = {
      ...newPool,
      ...marshalledData,
    }
  })

  return poolData
}