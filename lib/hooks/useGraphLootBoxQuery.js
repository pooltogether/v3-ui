import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getGraphLootBoxData } from 'lib/fetchers/getGraphLootBoxData'
import { useLootBoxSubgraphClient } from 'lib/hooks/subgraphClients/useLootBoxSubgraphClient'

export function useGraphLootBoxQuery(lootBoxAddress, tokenId, blockNumber = -1) {
  const { pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = useLootBoxSubgraphClient()

  lootBoxAddress = lootBoxAddress?.toLowerCase()

  const enabled = !pauseQueries && graphQLClient.url && lootBoxAddress && tokenId && blockNumber

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.lootBoxQuery, graphQLClient.url, lootBoxAddress, tokenId, blockNumber],
    async () => {
      return getGraphLootBoxData(graphQLClient, lootBoxAddress, tokenId, blockNumber)
    },
    {
      enabled: Boolean(enabled),
      refetchInterval
    }
  )
}
