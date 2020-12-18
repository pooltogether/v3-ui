import { useContext } from 'react'
import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPlayerPrizesData } from 'lib/fetchers/getPlayerPrizesData'

export function usePlayerPrizesQuery(address) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  address = address?.toLowerCase()

  const refetchInterval = MAINNET_POLLING_INTERVAL

  return useQuery(
    [QUERY_KEYS.playerPrizesQuery, chainId, address],
    async () => { return getPlayerPrizesData(chainId, address) },
    { 
      enabled: !pauseQueries && chainId && address,
      refetchInterval
    }
  )
}