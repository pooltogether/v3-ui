import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPoolDripsData } from 'lib/fetchers/getPoolDripsData'

export function usePoolDripsQuery(blockNumber = -1) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.poolDripsQuery, chainId, blockNumber],
    async () => {
      return getPoolDripsData(chainId, blockNumber)
    },
    {
      enabled: !pauseQueries && chainId && blockNumber,
      refetchInterval,
    }
  )
}
