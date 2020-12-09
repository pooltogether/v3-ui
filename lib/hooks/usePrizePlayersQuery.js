import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPrizePlayersData } from 'lib/fetchers/getPrizePlayersData'

export function usePrizePlayersQuery(pauseQueries, chainId, pool, blockNumber, page, skip) {
  if (!blockNumber) {
    blockNumber = -1
  }

  const refetchInterval = !pauseQueries && (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  const ticketAddress = pool?.ticketToken?.id

  return useQuery(
    [QUERY_KEYS.prizePlayersQuery, chainId, ticketAddress, blockNumber, page],
    async () => { return getPrizePlayersData(chainId, ticketAddress, blockNumber, skip) },
    { 
      enabled: !pauseQueries && chainId && ticketAddress && blockNumber && page,
      refetchInterval
    }
  )
}
