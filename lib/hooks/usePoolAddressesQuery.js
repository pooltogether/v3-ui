import gql from 'graphql-tag'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { request } from 'graphql-request'

import { POOLTOGETHER_SUBGRAPH_URIS, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'

export function usePoolAddressesQuery() {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  return useQuery(
    [QUERY_KEYS.poolAddressesQuery, chainId],
    async () => _getPoolAddressesData(chainId),
    {
      enabled: !pauseQueries && Boolean(chainId),
      refetchInterval: false,
      refetchOnWindowFocus: false
    }
  )
}


export const _getPoolAddressesData = async (chainId) => {
  const query = _poolAddressesQuery()

  const variables = {}

  let data = []
  try {
    data = await request(POOLTOGETHER_SUBGRAPH_URIS[chainId], query, variables)
    data = data.prizePools.map(prizePool => prizePool.id)
  } catch (error) {
    console.error(error)
  }

  return data
}

const _poolAddressesQuery = () => {
  return gql`
    query poolQuery {
      prizePools {
        id
      }
    }
  `
}
