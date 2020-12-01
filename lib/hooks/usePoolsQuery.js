import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getPoolsData } from 'lib/fetchers/getPoolsData'

export function usePoolsQuery(chainId, contractAddresses, blockNumber = -1) {
  return useQuery(
    [QUERY_KEYS.poolsQuery, chainId, blockNumber],
    async () => { return getPoolsData(chainId, contractAddresses, blockNumber) },
    { 
      enabled: chainId && blockNumber && !isEmpty(contractAddresses),
      refetchInterval: blockNumber === -1 ? 
        MAINNET_POLLING_INTERVAL :
        false
    }
  )
}
