import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL, PRIZE_PAGE_SIZE } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPoolPrizesData } from 'lib/fetchers/getPoolPrizesData'
import { getSubgraphClientByVersionFromContract } from 'lib/hooks/useSubgraphClients'
import { useChainId } from 'lib/hooks/useChainId'

export function usePoolPrizesQuery(poolContract, page, pageSize = PRIZE_PAGE_SIZE) {
  const { pauseQueries } = useContext(AuthControllerContext)
  const chainId = useChainId()

  const poolAddress = poolContract.prizePool.address

  return useQuery(
    [QUERY_KEYS.poolPrizesQuery, poolAddress, page, pageSize],
    async () => {
      return getPoolPrizesData(chainId, poolContract, page)
    },
    {
      enabled: Boolean(!pauseQueries && graphQLClient?.url && poolAddress && blockNumber && page),
      refetchInterval
    }
  )
}
