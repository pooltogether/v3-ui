import { useMemo } from 'react'

import { useCommunityPoolAddresses } from 'lib/hooks/useCommunityPoolAddresses'
import { useCommunityPoolsQuery } from 'lib/hooks/useCommunityPoolsQuery'
import { marshallPoolData } from 'lib/services/marshallPoolData'
import { poolToast } from 'lib/utils/poolToast'
import { symbolTemplate, nameTemplate } from 'lib/utils/communityPoolStringTemplates'

export function useCommunityPools () {
  const { communityPoolAddresses } = useCommunityPoolAddresses()

  let communityPools = []

  const poolAddresses = communityPoolAddresses
  let {
    refetch: communityRefetch,
    data: communityPoolsGraphData,
    error,
    isFetched
  } = useCommunityPoolsQuery(poolAddresses)

  if (error) {
    poolToast.error(error)
    console.error(error)
  }

  // communityPoolsGraphData = useMemo(() => {
  //   return _initializeCommunityPoolData(communityPoolsGraphData)
  // }, [communityPoolsGraphData])
  communityPoolsGraphData = _initializeCommunityPoolData(communityPoolsGraphData)

  // Make an array out of it for ease of use
  communityPools = useMemo(() => {
    if (communityPoolsGraphData) {
      const keys = Object.keys(communityPoolsGraphData)
      // console.log(
      //   keys?.map((key) => {
      //     return communityPoolsGraphData[key]
      //   })
      // )
      return keys?.map((key) => {
        return communityPoolsGraphData[key]
      })
    }
  }, [communityPoolsGraphData])

  const communityPoolsDataLoading = !isFetched

  return {
    communityPools,
    communityPoolsDataLoading,
    communityRefetch,
    communityPoolsGraphData
  }
}

const _initializeCommunityPoolData = (communityPoolsGraphData = []) => {
  let poolData = {}

  communityPoolsGraphData.forEach((poolGraphData) => {
    const marshalledData = marshallPoolData(poolGraphData)

    poolGraphData.isCommunityPool = true
    poolGraphData.isStakePrizePool = !poolGraphData.compoundPrizePool
    poolGraphData.name = nameTemplate(poolGraphData)
    poolGraphData.symbol = symbolTemplate(poolGraphData)

    poolData[poolGraphData.symbol] = {
      ...poolGraphData,
      ...marshalledData
    }
  })

  return poolData
}
