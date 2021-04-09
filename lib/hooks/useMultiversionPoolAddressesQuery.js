import gql from 'graphql-tag'
import { useContext } from 'react'
import { useQuery } from 'react-query'

import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useVersionedPoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/useVersionedPoolTogetherSubgraphClient'

export function useMultiversionPoolAddressesQuery() {
  // 3.1.0
  const version310 = '3.1.0'
  const {
    data: pools310Data,
    error: pools310Error,
    isFetched: pools310IsFetched
  } = usePoolAddressesQuery(version310)

  if (pools310Error) {
    console.error(pools310Error)
  }

  // 3.3.2
  const version332 = '3.3.2'
  let {
    data: pools332Data,
    error: pools332Error,
    isFetched: pools332IsFetched
  } = usePoolAddressesQuery(version332)

  if (pools332Error) {
    console.error(pools332Error)
  }

  // All Versions Combined
  const isFetched = pools310IsFetched && pools332IsFetched

  let data = []
  if (pools310Data && pools332Data) {
    data = [...pools310Data, ...pools332Data]
  }

  return {
    data,
    isFetched
  }
}

export function usePoolAddressesQuery(version) {
  const { pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = useVersionedPoolTogetherSubgraphClient(version)

  return useQuery(
    [QUERY_KEYS.poolAddressesQuery, graphQLClient.url],
    async () => _getPoolAddressesData(graphQLClient),
    {
      enabled: Boolean(!pauseQueries && graphQLClient.url),
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
