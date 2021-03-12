import gql from 'graphql-tag'
import { useContext } from 'react'
import { useQuery } from 'react-query'

import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraphClient'

export function usePoolAddressesQuery() {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = usePoolTogetherSubgraphClient()

  return useQuery(
    [QUERY_KEYS.poolAddressesQuery, chainId],
    async () => _getPoolAddressesData(graphQLClient),
    {
      enabled: !pauseQueries && Boolean(chainId),
      refetchInterval: false,
      refetchOnWindowFocus: false
    }
  )
}

export const _getPoolAddressesData = async (graphQLClient) => {
  const query = _poolAddressesQuery()

  const variables = {}

  let data = []
  try {
    data = await graphQLClient.request(query, variables)
    data = data.prizePools.map((prizePool) => prizePool.id)
  } catch (error) {
    console.error(error)
  }

  return data
}

const _poolAddressesQuery = () => {
  return gql`
    query poolQuery {
      prizePools(first: 1000) {
        id
      }
    }
  `
}
