import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPoolPrizesData } from 'lib/fetchers/getPoolPrizesData'

export function usePoolPrizesQuery(pool, page, skip, blockNumber = -1) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const poolAddress = pool?.id?.toLowerCase()

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.poolPrizesQuery, chainId, poolAddress, blockNumber, page],
    async () => {
      return getPoolPrizesData(chainId, poolAddress, blockNumber, skip)
    },
    {
      enabled: !pauseQueries && chainId && poolAddress && blockNumber && page,
      refetchInterval
    }
  )
}
