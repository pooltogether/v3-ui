import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPoolData } from 'lib/utils/getPoolData'

export function useTimeTravelPoolQuery(chainId, poolAddress, blockNumber) {
  if (!blockNumber) {
    blockNumber = -1
  }

  return useQuery(
    [QUERY_KEYS.poolQuery, poolAddress, blockNumber],
    async () => { return getPoolData(chainId, poolAddress, blockNumber) },
    { 
      enabled: poolAddress && blockNumber,
      refetchInterval: blockNumber === -1 ? 
        MAINNET_POLLING_INTERVAL :
        false
    }
  )
}
