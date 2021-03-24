import { useMemo } from 'react'
import { GraphQLClient } from 'graphql-request'

import { UNISWAP_GRAPH_URIS } from 'lib/constants/subgraphUris'
import { useTheGraphCustomFetch } from 'lib/hooks/subgraphClients/useTheGraphCustomFetch'

export const useUniswapSubgraphClient = () => {
  const customFetch = useTheGraphCustomFetch()

  return useMemo(() => {
    const endpoint = UNISWAP_GRAPH_URIS[1]
    return new GraphQLClient(endpoint, { fetch: customFetch })
  }, [])
}
