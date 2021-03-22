import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPlayerPrizesData } from 'lib/fetchers/getPlayerPrizesData'
import { usePoolTogetherSubgraph310Client } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraph310Client'

export function usePlayerPrizesQuery(address) {
  const { pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = usePoolTogetherSubgraph310Client()

  address = address?.toLowerCase()

  const refetchInterval = MAINNET_POLLING_INTERVAL

  return useQuery(
    [QUERY_KEYS.playerPrizesQuery, graphQLClient.url, address],
    async () => {
      return getPlayerPrizesData(graphQLClient, address)
    },
    {
      enabled: !pauseQueries && graphQLClient.url && address,
      refetchInterval
    }
  )
}
