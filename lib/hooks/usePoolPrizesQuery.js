import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPoolPrizesData } from 'lib/fetchers/getPoolPrizesData'

export function usePoolPrizesQuery(pauseQueries, chainId, pool, first, blockNumber) {
  blockNumber = blockNumber ? blockNumber : -1
  first = first ? first : -1

  const poolAddress = pool?.id?.toLowerCase()

  const refetchInterval = !pauseQueries && (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  return useQuery(
    [QUERY_KEYS.poolPrizesQuery, chainId, poolAddress, first, blockNumber],
    async () => { return getPoolPrizesData(chainId, poolAddress, first, blockNumber) },
    { 
      enabled: !pauseQueries && chainId && poolAddress && blockNumber,
      refetchInterval
    }
  )
}
