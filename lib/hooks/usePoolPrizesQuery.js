import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPoolPrizesData } from 'lib/utils/getPoolPrizesData'

export function usePoolPrizesQuery(chainId, pool, first, blockNumber) {
  blockNumber = blockNumber ? blockNumber : -1
  first = first ? first : -1

  const poolAddress = pool?.poolAddress

  return useQuery(
    [QUERY_KEYS.poolPrizesQuery, chainId, poolAddress, first, blockNumber],
    async () => { return getPoolPrizesData(chainId, poolAddress, first, blockNumber) },
    { 
      enabled: chainId && poolAddress && blockNumber,
      refetchInterval: blockNumber === -1 ? 
        MAINNET_POLLING_INTERVAL :
        false
    }
  )
}
