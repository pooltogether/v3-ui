import { useContext, useMemo } from 'react'
import { GraphQLClient } from 'graphql-request'

import { POOLTOGETHER_SUBGRAPHS } from 'lib/constants/subgraphUris'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useTheGraphCustomFetch } from 'lib/hooks/subgraphClients/useTheGraphCustomFetch'

export const usePoolTogetherSubgraph338Client = () => {
  const { chainId } = useContext(AuthControllerContext)
  const customFetch = useTheGraphCustomFetch()

  return useMemo(() => {
    const endpoint = POOLTOGETHER_SUBGRAPHS[chainId]?.['3.3.8']
    return new GraphQLClient(endpoint, { fetch: customFetch })
  }, [chainId])
}
