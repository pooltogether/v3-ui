import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPoolsData } from 'lib/fetchers/getPoolsData'
import { useVersionedPoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/useVersionedPoolTogetherSubgraphClient'

export function useCommunityPoolsQuery(poolAddresses, version) {
  const { pauseQueries } = useContext(AuthControllerContext)

  const graphQLClient = useVersionedPoolTogetherSubgraphClient(version)

  // enforce The Graph protocol's lowercase needs
  poolAddresses = poolAddresses?.map((address) => address.toLowerCase())

  return useQuery(
    [QUERY_KEYS.communityPoolsQuery, graphQLClient.url, version],
    async () => {
      return getPoolsData(graphQLClient, poolAddresses)
    },
    {
      enabled: !pauseQueries && graphQLClient && version && !isEmpty(poolAddresses),
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}
