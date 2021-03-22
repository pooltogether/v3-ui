import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPoolData } from 'lib/fetchers/getPoolData'
import { usePoolTogetherSubgraph310Client } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraph310Client'

export function usePoolQuery(poolAddress, blockNumber = -1) {
  const { pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = usePoolTogetherSubgraph310Client()

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  // enforce The Graph protocol's lowercase needs
  poolAddress = poolAddress.toLowerCase()

  return useQuery(
    [QUERY_KEYS.poolQuery, graphQLClient.url, poolAddress, blockNumber],
    async () => {
      return getPoolData(graphQLClient, poolAddress, blockNumber)
    },
    {
      enabled: !pauseQueries && graphQLClient.url && blockNumber && poolAddress,
      refetchInterval
    }
  )
}
