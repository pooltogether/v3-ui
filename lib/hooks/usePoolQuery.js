import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPoolData } from 'lib/fetchers/getPoolData'
import { useVersionedPoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/useVersionedPoolTogetherSubgraphClient'

export function usePoolQuery(poolAddress, version, blockNumber = -1) {
  const { pauseQueries } = useContext(AuthControllerContext)

  const graphQLClient = useVersionedPoolTogetherSubgraphClient(version)

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  // enforce The Graph protocol's lowercase needs
  poolAddress = poolAddress.toLowerCase()

  return useQuery(
    [QUERY_KEYS.poolQuery, graphQLClient?.url, poolAddress, blockNumber],
    async () => {
      return getPoolData(graphQLClient, poolAddress, version, blockNumber)
    },
    {
      enabled: !pauseQueries && version && graphQLClient?.url && blockNumber && poolAddress,
      refetchInterval
    }
  )
}
