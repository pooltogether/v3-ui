import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPoolPrizesData } from 'lib/fetchers/getPoolPrizesData'
import { getSubgraphClientsByVersionFromContract } from 'lib/hooks/useSubgraphClients'
import { useChainId } from 'lib/hooks/useChainId'

export function usePoolPrizesQuery(poolContract, page, skip, blockNumber = -1, pageSize = null) {
  const { pauseQueries } = useContext(AuthControllerContext)
  const chainId = useChainId()

  const graphQLClient = getSubgraphClientsByVersionFromContract(poolContract, chainId)?.[
    poolContract.subgraphVersion
  ]
  const poolAddress = poolContract.prizePool.address
  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.poolPrizesQuery, graphQLClient?.url, poolAddress, blockNumber, page, pageSize],
    async () => {
      return getPoolPrizesData(graphQLClient, poolAddress, blockNumber, skip, pageSize)
    },
    {
      enabled: Boolean(!pauseQueries && graphQLClient?.url && poolAddress && blockNumber && page),
      refetchInterval
    }
  )
}
