import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getControlledTokenBalancesData } from 'lib/fetchers/getControlledTokenBalancesData'
import { useVersionedPoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/useVersionedPoolTogetherSubgraphClient'

export function useControlledTokenBalanceQuery(pool, page, skip, blockNumber = -1) {
  const { pauseQueries } = useContext(AuthControllerContext)

  const graphQLClient = useVersionedPoolTogetherSubgraphClient(pool.version)

  const ticketAddress = pool?.ticketToken?.id?.toLowerCase()

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.controlledTokenBalancesQuery, graphQLClient?.url, ticketAddress, blockNumber, page],
    async () => {
      return getControlledTokenBalancesData(graphQLClient, ticketAddress, blockNumber, skip)
    },
    {
      enabled: Boolean(!pauseQueries && graphQLClient?.url && ticketAddress && blockNumber && page),
      refetchInterval
    }
  )
}
