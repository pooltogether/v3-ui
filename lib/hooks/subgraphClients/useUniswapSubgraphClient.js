import { GraphQLClient } from 'graphql-request'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { UNISWAP_GRAPH_URIS } from 'lib/constants'
import { useTheGraphCustomFetch } from 'lib/hooks/subgraphClients/useTheGraphCustomFetch'
import { useContext, useMemo } from 'react'

export const useUniswapSubgraphClient = () => {
  const customFetch = useTheGraphCustomFetch()

  return useMemo(() => {
    const endpoint = UNISWAP_GRAPH_URIS[1]
    return new GraphQLClient(endpoint, { fetch: customFetch })
  }, [])
}
