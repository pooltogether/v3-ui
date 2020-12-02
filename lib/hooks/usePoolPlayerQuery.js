import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPoolPlayerData } from 'lib/fetchers/getPoolPlayerData'

export function usePoolPlayerQuery(pauseQueries, chainId, pool, playerAddress, blockNumber, error) {
  blockNumber = blockNumber ? blockNumber : -1
  
  const poolAddress = pool?.poolAddress

  const refetchInterval = !pauseQueries && (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  return useQuery(
    [QUERY_KEYS.poolPlayerQuery, chainId, poolAddress, playerAddress, blockNumber],
    async () => { return getPoolPlayerData(chainId, poolAddress, playerAddress, blockNumber) },
    { 
      enabled: !pauseQueries && chainId && poolAddress && playerAddress && blockNumber && !error,
      refetchInterval
    }
  )
}
