import { useContext, useMemo } from 'react'
import { GraphQLClient } from 'graphql-request'

import { LOOTBOX_GRAPH_URIS } from 'lib/constants/subgraphUris'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useTheGraphCustomFetch } from 'lib/hooks/subgraphClients/useTheGraphCustomFetch'

export const useLootBoxSubgraphClient = () => {
  const { chainId } = useContext(AuthControllerContext)
  const customFetch = useTheGraphCustomFetch()

  return useMemo(() => {
    const endpoint = LOOTBOX_GRAPH_URIS[chainId]
    return new GraphQLClient(endpoint, { fetch: customFetch })
  }, [chainId])
}
