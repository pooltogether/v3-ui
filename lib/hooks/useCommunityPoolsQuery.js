import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPoolsData } from 'lib/fetchers/getPoolsData'
import { usePoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraphClient'

export function useCommunityPoolsQuery(poolAddresses) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = usePoolTogetherSubgraphClient()

  // enforce The Graph protocol's lowercase needs
  poolAddresses = poolAddresses?.map((address) => address.toLowerCase())

  return useQuery(
    [QUERY_KEYS.communityPoolsQuery, graphQLClient.url],
    async () => {
      return getPoolsData(graphQLClient, poolAddresses)
    },
    {
      enabled: !pauseQueries && graphQLClient && !isEmpty(poolAddresses),
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}
