import { useQuery } from 'react-query'

import {
  UNISWAP_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getUniswapData } from 'lib/fetchers/getUniswapData'

export function useUniswapTokensQuery(chainId, poolAddress, blockNumber, addresses) {
  const cacheKey = [
    QUERY_KEYS.uniswapTokensQuery,
    poolAddress,
    blockNumber
  ]

  return useQuery(
    cacheKey,
    async () => { return getUniswapData(chainId, addresses, blockNumber) },
    {
      enabled: chainId && poolAddress && addresses,
      refetchInterval: blockNumber === -1 ? 
        UNISWAP_POLLING_INTERVAL :
        false
    }
  )
}
