import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPoolDripsData } from 'lib/fetchers/getPoolDripsData'

export function usePoolDripsQuery(chainId, pool, blockNumber = -1) {
  const prizeStrategyAddress = pool?.prizeStrategy?.id

  return useQuery(
    [QUERY_KEYS.poolDripsQuery, chainId, prizeStrategyAddress, blockNumber],
    async () => { return getPoolDripsData(chainId, prizeStrategyAddress, blockNumber) },
    {
      enabled: chainId && prizeStrategyAddress && blockNumber,
      refetchInterval: blockNumber === -1 ? 
        MAINNET_POLLING_INTERVAL :
        false
    }
  )
}
