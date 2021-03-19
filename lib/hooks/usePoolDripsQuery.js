import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPoolDripsData } from 'lib/fetchers/getPoolDripsData'
import { usePoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraphClient'

export function usePoolDripsQuery(blockNumber = -1) {
  const { pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = usePoolTogetherSubgraphClient()

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.poolDripsQuery, graphQLClient.url, blockNumber],
    async () => {
      return getPoolDripsData(graphQLClient, blockNumber)
    },
    {
      enabled: !pauseQueries && graphQLClient.url && blockNumber,
      refetchInterval
    }
  )
}
