import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPlayerData } from 'lib/utils/getPlayerData'

export function usePlayerQuery(chainId, pool, playerAddress, blockNumber) {
  if (!blockNumber) {
    blockNumber = -1
  }

  const poolAddress = pool?.poolAddress

  return useQuery(
    [QUERY_KEYS.playerQuery, poolAddress, playerAddress, blockNumber],
    async () => { return getPlayerData(chainId, poolAddress, playerAddress, blockNumber) },
    { 
      enabled: chainId && poolAddress && playerAddress && blockNumber,
      refetchInterval: blockNumber === -1 ? 
        MAINNET_POLLING_INTERVAL :
        false
    }
  )
}
