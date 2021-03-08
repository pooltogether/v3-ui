import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPoolPrizesData } from 'lib/fetchers/getPoolPrizesData'
import { usePoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraphClient'

export function usePoolPrizesQuery(pool, page, skip, blockNumber = -1) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = usePoolTogetherSubgraphClient()

  const poolAddress = pool?.id?.toLowerCase()

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.poolPrizesQuery, chainId, poolAddress, blockNumber, page],
    async () => {
      return getPoolPrizesData(graphQLClient, poolAddress, blockNumber, skip)
    },
    {
      enabled: !pauseQueries && chainId && poolAddress && blockNumber && page,
      refetchInterval
    }
  )
}
