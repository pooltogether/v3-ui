import { useContext, useMemo } from 'react'
import { GraphQLClient } from 'graphql-request'

import { POOLTOGETHER_SUBGRAPH_URIS, POOLTOGETHER_SUBGRAPH_332_URIS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useTheGraphCustomFetch } from 'lib/hooks/subgraphClients/useTheGraphCustomFetch'

export const usePoolTogetherSubgraphClient = () => {
  const { chainId } = useContext(AuthControllerContext)
  const customFetch = useTheGraphCustomFetch()

  // NEXT_JS_SUBGRAPH_URI_MAINNET_332

  return useMemo(() => {
    const endpoint = POOLTOGETHER_SUBGRAPH_URIS[chainId]
    return new GraphQLClient(endpoint, { fetch: customFetch })
  }, [chainId])
}
