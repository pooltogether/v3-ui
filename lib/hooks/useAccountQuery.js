import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getAccountData } from 'lib/fetchers/getAccountData'

export function useAccountQuery(pauseQueries, chainId, playerAddress, blockNumber = -1, error = null) {
  const refetchInterval = !pauseQueries && (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  return useQuery(
    [QUERY_KEYS.playerQuery, chainId, playerAddress, blockNumber],
    async () => { return getAccountData(chainId, playerAddress, blockNumber) },
    { 
      enabled: !pauseQueries && chainId && playerAddress && blockNumber && !error,
      refetchInterval
    }
  )
}
