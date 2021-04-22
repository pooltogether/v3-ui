import { useQuery, useQueryClient } from 'react-query'

import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useEnvChainIds } from 'lib/hooks/chainId/useEnvChainIds'
import { readProvider } from 'lib/services/readProvider'

/**
 *
 * @returns Providers for all environment chain ids
 */
export const useEnvReadProviders = () => {
  const chainIds = useEnvChainIds()
  const queryClient = useQueryClient()

  return useQuery(
    [QUERY_KEYS.envProviders, chainIds],
    () => Promise.all(chainIds.map(async (chainId) => await readProvider(chainId))),
    { onSuccess: (readProviders) => populateCache(queryClient, readProviders) }
  )
}

const populateCache = (queryClient, readProviders) =>
  readProviders.forEach((readProvider) =>
    queryClient.setQueryData([QUERY_KEYS.readProvider, readProvider.network.chainId], readProvider)
  )
