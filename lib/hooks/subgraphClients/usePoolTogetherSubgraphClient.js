import { GraphQLClient } from 'graphql-request'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { POOLTOGETHER_SUBGRAPH_URIS } from 'lib/constants'
import { useTheGraphCustomFetch } from 'lib/hooks/subgraphClients/useTheGraphCustomFetch'
import { useContext, useMemo } from 'react'

export const usePoolTogetherSubgraphClient = () => {
  const { chainId } = useContext(AuthControllerContext)
  const customFetch = useTheGraphCustomFetch()

  return useMemo(() => {
    const endpoint = POOLTOGETHER_SUBGRAPH_URIS[chainId]
    return new GraphQLClient(endpoint, { fetch: customFetch })
  }, [chainId])
}
