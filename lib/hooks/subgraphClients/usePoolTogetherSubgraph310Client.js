import { useContext, useMemo } from 'react'
import { GraphQLClient } from 'graphql-request'

import { POOLTOGETHER_SUBGRAPHS } from 'lib/constants/subgraphUris'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useTheGraphCustomFetch } from 'lib/hooks/subgraphClients/useTheGraphCustomFetch'

export const usePoolTogetherSubgraph310Client = () => {
  const { chainId } = useContext(AuthControllerContext)
  const customFetch = useTheGraphCustomFetch()

  return useMemo(() => {
    const endpoint = POOLTOGETHER_SUBGRAPHS[chainId]?.['3.1.0']
    return new GraphQLClient(endpoint, { fetch: customFetch })
  }, [chainId])
}
