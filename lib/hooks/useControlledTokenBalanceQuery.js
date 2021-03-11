import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getControlledTokenBalancesData } from 'lib/fetchers/getControlledTokenBalancesData'
import { usePoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraphClient'

export function useControlledTokenBalanceQuery(pool, page, skip, blockNumber = -1) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = usePoolTogetherSubgraphClient()

  const ticketAddress = pool?.ticketToken?.id?.toLowerCase()

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.controlledTokenBalancesQuery, chainId, ticketAddress, blockNumber, page],
    async () => {
      return getControlledTokenBalancesData(graphQLClient, ticketAddress, blockNumber, skip)
    },
    {
      enabled: !pauseQueries && chainId && ticketAddress && blockNumber && page,
      refetchInterval
    }
  )
}
