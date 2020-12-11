import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPoolData } from 'lib/fetchers/getPoolData'

export function useTimeTravelPoolQuery(pauseQueries, chainId, poolAddress, blockNumber) {
  if (!blockNumber) {
    blockNumber = -1
  }

  const refetchInterval = !pauseQueries && (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  return useQuery(
    [QUERY_KEYS.poolQuery, chainId, poolAddress, blockNumber],
    async () => { return getPoolData(chainId, poolAddress, blockNumber) },
    { 
      enabled: !pauseQueries && chainId && poolAddress && blockNumber,
      refetchInterval
    }
  )
}
