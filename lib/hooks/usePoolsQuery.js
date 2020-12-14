import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPoolsData } from 'lib/fetchers/getPoolsData'

export function usePoolsQuery(pauseQueries, chainId, poolAddresses, blockNumber = -1) {
  const refetchInterval = !pauseQueries && (blockNumber === -1) ? 
    MAINNET_POLLING_INTERVAL :
    false

  poolAddresses = poolAddresses?.map(address => address.toLowerCase())

  return useQuery(
    [QUERY_KEYS.poolsQuery, chainId, blockNumber],
    async () => { return getPoolsData(chainId, poolAddresses, blockNumber) },
    { 
      enabled: !pauseQueries && chainId && blockNumber && !isEmpty(poolAddresses),
      refetchInterval
    }
  )
}
