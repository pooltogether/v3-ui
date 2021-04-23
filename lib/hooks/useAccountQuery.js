import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getAccountData } from 'lib/fetchers/getAccountData'
import { testAddress } from 'lib/utils/testAddress'
import { getSubgraphClientFromChainIdAndVersion } from 'lib/utils/getSubgraphClients'

// TODO: This could be updated to `useAccountsQuery` and query multiple accounts at once for listing
// prize winners odds & deposits
export function useAccountQuery(chainId, address, version, blockNumber = -1) {
  const { pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = getSubgraphClientFromChainIdAndVersion(chainId, version)

  const addressError = testAddress(address)

  address = address?.toLowerCase()

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.accountQuery, chainId, graphQLClient?.url, address, blockNumber],
    async () => getAccountData(graphQLClient, address, blockNumber),
    {
      enabled: Boolean(
        !pauseQueries && version && chainId && address && blockNumber && !addressError
      ),
      refetchInterval
    }
  )
}
