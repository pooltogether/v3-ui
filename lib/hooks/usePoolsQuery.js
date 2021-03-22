import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPoolsData } from 'lib/fetchers/getPoolsData'
import { usePoolTogetherSubgraph310Client } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraph310Client'
import { usePoolTogetherSubgraph332Client } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraph332Client'

export function usePoolsQuery(poolAddresses, version) {
  const { pauseQueries } = useContext(AuthControllerContext)

  let graphQLClient
  switch (version) {
    case '3.1.0':
      graphQLClient = usePoolTogetherSubgraph310Client()
      break
    case '3.3.2':
      graphQLClient = usePoolTogetherSubgraph332Client()
      break
    default:
      console.error('error: proper version # not supplied!')
      break
  }

  // enforce The Graph protocol's lowercase needs
  poolAddresses = poolAddresses?.map((address) => address.toLowerCase())

  return useQuery(
    [QUERY_KEYS.poolsQuery, graphQLClient.url],
    async () => {
      return getPoolsData(graphQLClient, poolAddresses)
    },
    {
      enabled: !pauseQueries && graphQLClient && !isEmpty(poolAddresses),
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}
