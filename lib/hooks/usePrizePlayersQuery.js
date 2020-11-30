import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPrizePlayersData } from 'lib/fetchers/getPrizePlayersData'

export function usePrizePlayersQuery(chainId, pool, blockNumber, page, skip) {
  if (!blockNumber) {
    blockNumber = -1
  }

  const poolAddress = pool?.poolAddress

  return useQuery(
    [QUERY_KEYS.prizePlayersQuery, poolAddress, blockNumber, page],
    async () => { return getPrizePlayersData(chainId, poolAddress, blockNumber, skip) },
    { 
      enabled: poolAddress && blockNumber && page,
      refetchInterval: blockNumber === -1 ? 
        MAINNET_POLLING_INTERVAL :
        false
    }
  )
}
