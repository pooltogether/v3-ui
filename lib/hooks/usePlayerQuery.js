import { useContext } from 'react'
import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPlayerData } from 'lib/fetchers/getPlayerData'

export function usePlayerQuery(playerAddress, blockNumber = -1, error = null) {
  const {
    chainId,
    pauseQueries,
  } = useContext(AuthControllerContext)

  const refetchInterval = !pauseQueries && (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  return useQuery(
    [QUERY_KEYS.playerQuery, chainId, playerAddress, blockNumber],
    async () => { return getPlayerData(chainId, playerAddress, blockNumber) },
    { 
      enabled: !pauseQueries && chainId && playerAddress && blockNumber && !error,
      refetchInterval
    }
  )
}