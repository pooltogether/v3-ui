import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPoolsData } from 'lib/fetchers/getPoolsData'

// , usersAddress, blockNumber, playerAddressError)
export function useAccountQuery(pauseQueries, chainId, usersAddress, blockNumber = -1, playerAddressError = '') {
  const refetchInterval = !pauseQueries && (blockNumber === -1) ? 
    MAINNET_POLLING_INTERVAL :
    false

  return { data: null }

  // return useQuery(
  //   [QUERY_KEYS.poolsQuery, chainId, blockNumber],
  //   async () => { return getPoolsData(chainId, contractAddresses, blockNumber) },
  //   { 
  //     enabled: !pauseQueries && chainId && blockNumber && !isEmpty(contractAddresses),
  //     refetchInterval
  //   }
  // )
}
