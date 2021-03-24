import { useMemo } from 'react'

import { useCommunityPoolAddresses } from 'lib/hooks/useCommunityPoolAddresses'
import { useCommunityPoolsQuery } from 'lib/hooks/useCommunityPoolsQuery'
import { extendedCommunityPoolMetadata } from 'lib/services/extendedCommunityPoolMetadata'
import { marshallPoolData } from 'lib/services/marshallPoolData'
import { poolToast } from 'lib/utils/poolToast'

const _compileArray = (graphData) => {
  const keys = Object.keys(graphData)

  return keys?.map((key) => {
    return graphData[key]
  })
}

export function useMultiversionCommunityPools() {
  const { communityPoolAddresses } = useCommunityPoolAddresses()
  const poolAddresses = communityPoolAddresses

  let communityPools = []

  // 3.1.0
  const version310 = '3.1.0'
  let {
    refetch: pools310Refetch,
    data: pools310GraphData,
    error: pools310Error,
    isFetched: pools310IsFetched
  } = useCommunityPoolsQuery(poolAddresses, version310)

  if (pools310Error) {
    poolToast.error(pools310Error)
    console.error(pools310Error)
  }

  pools310GraphData = _initializeCommunityPoolData(version310, pools310GraphData)

  // 3.3.2
  const version332 = '3.3.2'
  let {
    refetch: pools332Refetch,
    data: pools332GraphData,
    error: pools332Error,
    isFetched: pools332IsFetched
  } = useCommunityPoolsQuery(poolAddresses, version332)

  if (pools332Error) {
    poolToast.error(pools332Error)
    console.error(pools332Error)
  }

  pools332GraphData = _initializeCommunityPoolData(version332, pools332GraphData)

  // All Versions Combined
  const communityPoolsGraphData = {
    ...pools310GraphData,
    ...pools332GraphData
  }

  // Make an array out of it for ease of use
  communityPools = useMemo(() => {
    const pools310Array = pools310GraphData ? _compileArray(pools310GraphData) : []
    const pools332Array = pools332GraphData ? _compileArray(pools332GraphData) : []

    return [...pools310Array, ...pools332Array]
  }, [pools310GraphData])

  const communityPoolsDataLoading = !pools310IsFetched || !pools332IsFetched

  const communityRefetch = () => {
    pools310Refetch()
    pools332Refetch()
  }

  return {
    communityPools,
    communityPoolsDataLoading,
    communityRefetch,
    communityPoolsGraphData
  }
}

const _initializeCommunityPoolData = (version, poolsGraphData = []) => {
  let poolData = {}

  poolsGraphData.forEach((poolGraphData) => {
    const marshalledData = marshallPoolData(poolGraphData)

    poolGraphData.version = version

    // extendedCommunityPoolMetadata
    // poolGraphData.isCommunityPool = true
    // poolGraphData.name = nameTemplate(poolGraphData)
    // poolGraphData.symbol = symbolTemplate(poolGraphData)
    const extendedMetadata = extendedCommunityPoolMetadata(poolGraphData)

    poolData[extendedMetadata.symbol] = {
      ...extendedMetadata,
      ...poolGraphData,
      ...marshalledData
    }
  })

  return poolData
}
