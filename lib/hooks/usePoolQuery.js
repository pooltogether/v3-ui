import { useContext } from 'react'
import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPoolData } from 'lib/fetchers/getPoolData'

export function usePoolQuery(poolAddress, blockNumber = -1) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const refetchInterval = (blockNumber === -1) ? 
    MAINNET_POLLING_INTERVAL :
    false

  // enforce The Graph protocol's lowercase needs
  poolAddress = poolAddress.toLowerCase()

  return useQuery(
    [QUERY_KEYS.poolQuery, chainId, poolAddress, blockNumber],
    async () => { return getPoolData(chainId, poolAddress, blockNumber) },
    { 
      enabled: !pauseQueries && chainId && blockNumber && poolAddress,
      refetchInterval
    }
  )
}
