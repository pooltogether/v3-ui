import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPrizePoolAccountData } from 'lib/fetchers/getPrizePoolAccountData'
import { usePoolTogetherSubgraph310Client } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraph310Client'

export function usePrizePoolAccountQuery(pool, playerAddress, blockNumber = -1, error = null) {
  const { pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = usePoolTogetherSubgraph310Client()

  const poolAddress = pool?.id?.toLowerCase()

  const enabled =
    !pauseQueries && graphQLClient.url && poolAddress && playerAddress && blockNumber && !error

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.prizePoolAccountQuery, graphQLClient.url, poolAddress, playerAddress, blockNumber],
    async () => {
      return getPrizePoolAccountData(graphQLClient, poolAddress, playerAddress, blockNumber)
    },
    {
      enabled,
      refetchInterval
    }
  )
}
