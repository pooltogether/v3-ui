import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPrizeData } from 'lib/fetchers/getPrizeData'

export function usePrizeQuery(pauseQueries, chainId, pool, prizeId, blockNumber = -1) {
  const poolAddress = pool?.id?.toLowerCase()

  const refetchInterval = !pauseQueries && (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  return useQuery(
    [QUERY_KEYS.prizeQuery, chainId, poolAddress, prizeId, blockNumber],
    async () => { return getPrizeData(chainId, poolAddress, prizeId, blockNumber) },
    {
      enabled: !pauseQueries && chainId && poolAddress && prizeId && blockNumber,
      refetchInterval
    }
  )
}
