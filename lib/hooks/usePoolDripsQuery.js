import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPoolDripsData } from 'lib/fetchers/getPoolDripsData'

export function usePoolDripsQuery(pauseQueries, chainId, blockNumber = -1) {
  const refetchInterval = !pauseQueries && (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  return useQuery(
    [QUERY_KEYS.poolDripsQuery, chainId, blockNumber],
    async () => { return getPoolDripsData(chainId, blockNumber) },
    {
      enabled: !pauseQueries && chainId && blockNumber,
      refetchInterval
    }
  )
}
