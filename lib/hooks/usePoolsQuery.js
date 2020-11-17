import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPoolsData } from 'lib/utils/getPoolsData'

export function usePoolsQuery(chainId, poolAddresses, blockNumber) {
  if (!blockNumber) {
    blockNumber = -1
  }

  return useQuery(
    [QUERY_KEYS.poolsQuery, poolAddresses, blockNumber],
    async () => { return getPoolsData(chainId, poolAddresses, blockNumber) },
    { 
      enabled: poolAddresses && poolAddresses.length > 0 && blockNumber,
      refetchInterval: blockNumber === -1 ? 
        MAINNET_POLLING_INTERVAL :
        false
    }
  )
}
