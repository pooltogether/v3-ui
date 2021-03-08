import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getAccountData } from 'lib/fetchers/getAccountData'
import { usePoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraphClient'

export function useAccountQuery(address, blockNumber = -1, error = null) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = usePoolTogetherSubgraphClient()

  address = address?.toLowerCase()

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.accountQuery, chainId, address, blockNumber],
    async () => getAccountData(graphQLClient, address, blockNumber),
    {
      enabled: !pauseQueries && chainId && address && blockNumber && !error,
      refetchInterval
    }
  )
}
