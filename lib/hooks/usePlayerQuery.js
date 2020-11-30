import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPlayerData } from 'lib/fetchers/getPlayerData'

export function usePlayerQuery(chainId, playerAddress, blockNumber = -1, error = null) {
  return useQuery(
    [QUERY_KEYS.playerQuery, chainId, playerAddress, blockNumber],
    async () => { return getPlayerData(chainId, playerAddress, blockNumber) },
    { 
      enabled: chainId && playerAddress && blockNumber && !error,
      refetchInterval: blockNumber === -1 ? 
        MAINNET_POLLING_INTERVAL :
        false
    }
  )
}
