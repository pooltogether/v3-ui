import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getGraphLootBoxData } from 'lib/fetchers/getGraphLootBoxData'

export function useGraphLootBoxQuery(lootBoxAddress, tokenId, blockNumber = -1) {
  const { pauseQueries, chainId } = useContext(AuthControllerContext)

  lootBoxAddress = lootBoxAddress?.toLowerCase()

  const enabled = !pauseQueries && chainId && lootBoxAddress && tokenId && blockNumber

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.lootBoxQuery, chainId, lootBoxAddress, tokenId, blockNumber],
    async () => {
      return getGraphLootBoxData(chainId, lootBoxAddress, tokenId, blockNumber)
    },
    {
      enabled: Boolean(enabled),
      refetchInterval
    }
  )
}
