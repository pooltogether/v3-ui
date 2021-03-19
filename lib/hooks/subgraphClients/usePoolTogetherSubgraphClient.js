import { useContext, useMemo } from 'react'
import { GraphQLClient } from 'graphql-request'

import { POOLTOGETHER_SUBGRAPH_URIS, POOLTOGETHER_SUBGRAPH_332_URIS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useTheGraphCustomFetch } from 'lib/hooks/subgraphClients/useTheGraphCustomFetch'

export const usePoolTogetherSubgraphClient = (version) => {
  const { chainId } = useContext(AuthControllerContext)
  const customFetch = useTheGraphCustomFetch()

  let endpoint
  switch (version) {
    case '3.3.0':
      endpoint = POOLTOGETHER_SUBGRAPH_URIS[chainId]
    case '3.3.2':
      endpoint = POOLTOGETHER_SUBGRAPH_332_URIS[chainId]
    default:
      console.error('error! proper version # not supplied to usePoolTogetherSubgraphClient()')
  }

  return useMemo(() => {
    // const endpoint = POOLTOGETHER_SUBGRAPH_URIS[chainId]
    return new GraphQLClient(endpoint, { fetch: customFetch })
  }, [chainId])
}
