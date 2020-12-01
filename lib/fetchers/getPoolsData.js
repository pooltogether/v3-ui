import { request } from 'graphql-request'

import { POOLTOGETHER_GRAPH_URIS } from 'lib/constants'
import { prizePoolsQuery } from 'lib/queries/prizePoolsQuery'

export const getPoolsData = async (chainId, contractAddresses, blockNumber) => {
  const variables = {
    poolAddresses: contractAddresses.pools
  }
  const query = prizePoolsQuery(blockNumber)

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

  return data?.prizePools
}
