import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { getPlayerData } from 'lib/fetchers/getPlayerData'
import { NETWORK } from 'lib/utils/networks'
import { getSubgraphClientFromChainIdAndVersion } from 'lib/utils/getSubgraphClients'

// This is deprecated but needs to be around for the old rewards system so people
// can still claim from the drips. It only needs the 3_1_0 subgraph
export function usePlayerQuery(address, blockNumber = -1, error = null) {
  const graphQLClient = getSubgraphClientFromChainIdAndVersion(NETWORK.mainnet, '3.1.0')

  address = address?.toLowerCase()

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.playerQuery, graphQLClient.url, address, blockNumber],
    async () => {
      return getPlayerData(graphQLClient, address, blockNumber)
    },
    {
      enabled: Boolean(graphQLClient.url && address && blockNumber && !error),
      refetchInterval
    }
  )
}
