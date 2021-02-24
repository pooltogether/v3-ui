import { useMemo } from 'react'

import { useCommunityPoolAddresses } from 'lib/hooks/useCommunityPoolAddresses'
import { useCommunityPoolsQuery } from 'lib/hooks/useCommunityPoolsQuery'
import { marshallPoolData } from 'lib/services/marshallPoolData'
import { poolToast } from 'lib/utils/poolToast'

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

  communityPoolsGraphData = useMemo(() => {
    return _initializeCommunityPoolData(communityPoolsGraphData)
  }, [communityPoolsGraphData])

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

const _initializeCommunityPoolData = (pools = []) => {
  let poolData = {}

  pools.forEach((pool) => {
    const marshalledData = marshallPoolData(pool)

    // console.log(pool)
    let newPool = Object.assign({}, pool)
    newPool.isCommunityPool = true
    newPool.name = `${pool.underlyingCollateralSymbol}-${pool.id.substr(0, 8)}`
    newPool.symbol = `${pool.underlyingCollateralSymbol}-${pool.id.substr(0, 8)}`

    // console.log(newPool)
    poolData[newPool.symbol] = {
      ...newPool,
      ...marshalledData,
    }
  })

  return poolData
}