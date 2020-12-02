import { useQuery } from 'react-query'

import {
  UNISWAP_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getUniswapData } from 'lib/fetchers/getUniswapData'

export function useUniswapTokensQuery(pauseQueries, chainId, poolAddress, blockNumber, addresses) {
  const cacheKey = [
    QUERY_KEYS.uniswapTokensQuery,
    chainId,
    poolAddress,
    blockNumber
  ]

  const refetchInterval = !pauseQueries && (blockNumber === -1) ?
    UNISWAP_POLLING_INTERVAL :
    false

  return useQuery(
    cacheKey,
    async () => { return getUniswapData(chainId, addresses, blockNumber) },
    {
      enabled: !pauseQueries && chainId && poolAddress && addresses,
      refetchInterval
    }
  )
}
