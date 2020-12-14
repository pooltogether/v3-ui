import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getControlledTokenBalancesData } from 'lib/fetchers/getControlledTokenBalancesData'

export function useControlledTokenBalanceQuery(pauseQueries, chainId, pool, blockNumber, page, skip) {
  if (!blockNumber) {
    blockNumber = -1
  }

  const refetchInterval = !pauseQueries && (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  const ticketAddress = pool?.ticketToken?.id?.toLowerCase()

  return useQuery(
    [QUERY_KEYS.controlledTokenBalancesQuery, chainId, ticketAddress, blockNumber, page],
    async () => { return getControlledTokenBalancesData(chainId, ticketAddress, blockNumber, skip) },
    { 
      enabled: !pauseQueries && chainId && ticketAddress && blockNumber && page,
      refetchInterval
    }
  )
}
