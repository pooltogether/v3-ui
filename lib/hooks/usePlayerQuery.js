import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPlayerData } from 'lib/fetchers/getPlayerData'

export function usePlayerQuery(pauseQueries, chainId, playerAddress, blockNumber = -1, error = null) {
  const refetchInterval = !pauseQueries && (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  return useQuery(
    [QUERY_KEYS.playerQuery, chainId, playerAddress, blockNumber],
    async () => { return getPlayerData(chainId, playerAddress, blockNumber) },
    { 
      enabled: !pauseQueries && chainId && playerAddress && blockNumber && !error,
      refetchInterval
    }
  )
}
