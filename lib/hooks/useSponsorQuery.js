import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getSponsorData } from 'lib/fetchers/getSponsorData'

export function useSponsorQuery(pauseQueries, chainId, sponsorAddress, blockNumber = -1, error = null) {
  const refetchInterval = !pauseQueries && (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  return useQuery(
    [QUERY_KEYS.sponsorQuery, chainId, sponsorAddress, blockNumber],
    async () => { return getSponsorData(chainId, sponsorAddress, blockNumber) },
    { 
      enabled: !pauseQueries && chainId && sponsorAddress && blockNumber && !error,
      refetchInterval
    }
  )
}
