import { request } from 'graphql-request'

import { POOLTOGETHER_GRAPH_URIS } from 'lib/constants'
import { poolsQuery } from 'lib/queries/poolsQuery'

export const getPoolsData = async (chainId, poolAddresses, blockNumber) => {
  const variables = {
    ids: poolAddresses
  }

  const query = poolsQuery(blockNumber)

  let data
  try {
    data = await request(
      POOLTOGETHER_GRAPH_URIS[chainId],
      query,
      variables
    )
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data.prizePools
}
