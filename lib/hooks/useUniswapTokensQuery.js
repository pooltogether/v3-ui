import { useQuery } from 'react-query'

import {
  UNISWAP_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getUniswapData } from 'lib/utils/getUniswapData'

export function useUniswapTokensQuery(chainId, poolAddress, blockNumber, addresses) {
  if (!blockNumber) {
    blockNumber = -1
  }

  return useQuery(
    [QUERY_KEYS.uniswapTokensQuery, poolAddress, blockNumber],
    async () => { return getUniswapData(chainId, addresses) },
    { 
      enabled: chainId && poolAddress && addresses,
      refetchInterval: blockNumber === -1 ? 
        UNISWAP_POLLING_INTERVAL :
        false
    }
  )
}
