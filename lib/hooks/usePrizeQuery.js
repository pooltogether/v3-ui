import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPrizeData } from 'lib/fetchers/getPrizeData'
import { usePoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraphClient'

export function usePrizeQuery(pool, prizeId, blockNumber = -1) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = usePoolTogetherSubgraphClient()

  const poolAddress = pool?.id?.toLowerCase()

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.prizeQuery, chainId, poolAddress, prizeId, blockNumber],
    async () => {
      return getPrizeData(graphQLClient, poolAddress, prizeId, blockNumber)
    },
    {
      enabled: !pauseQueries && chainId && poolAddress && prizeId && blockNumber,
      refetchInterval
    }
  )
}
