import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPrizeData } from 'lib/fetchers/getPrizeData'
import { useVersionedPoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/useVersionedPoolTogetherSubgraphClient'

export function usePrizeQuery(pool, prizeId, blockNumber = -1) {
  const { pauseQueries } = useContext(AuthControllerContext)

  const graphQLClient = useVersionedPoolTogetherSubgraphClient(pool?.version)

  const poolAddress = pool?.id?.toLowerCase()

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.prizeQuery, graphQLClient?.url, poolAddress, prizeId, blockNumber],
    async () => {
      return getPrizeData(graphQLClient, poolAddress, prizeId, blockNumber)
    },
    {
      enabled: Boolean(
        !pauseQueries && graphQLClient?.url && poolAddress && prizeId && blockNumber
      ),
      refetchInterval
    }
  )
}
