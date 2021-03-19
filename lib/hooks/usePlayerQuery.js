import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPlayerData } from 'lib/fetchers/getPlayerData'
import { usePoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraphClient'

export function usePlayerQuery(address, blockNumber = -1, error = null) {
  const { pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = usePoolTogetherSubgraphClient()

  address = address?.toLowerCase()

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.playerQuery, graphQLClient.url, address, blockNumber],
    async () => {
      return getPlayerData(graphQLClient, address, blockNumber)
    },
    {
      enabled: !pauseQueries && graphQLClient.url && address && blockNumber && !error,
      refetchInterval
    }
  )
}
