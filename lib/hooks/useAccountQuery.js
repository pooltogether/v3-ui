import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getAccountData } from 'lib/fetchers/getAccountData'
import { usePoolTogetherSubgraph310Client } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraph310Client'

export function useAccountQuery(address, blockNumber = -1, error = null) {
  const { pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = usePoolTogetherSubgraph310Client()

  address = address?.toLowerCase()

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.accountQuery, graphQLClient.url, address, blockNumber],
    async () => getAccountData(graphQLClient, address, blockNumber),
    {
      enabled: !pauseQueries && graphQLClient.url && address && blockNumber && !error,
      refetchInterval
    }
  )
}
