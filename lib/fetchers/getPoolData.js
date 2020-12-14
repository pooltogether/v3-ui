import { request } from 'graphql-request'

import { POOLTOGETHER_CURRENT_GRAPH_URIS } from 'lib/constants'
import { prizePoolsQuery } from 'lib/queries/prizePoolsQuery'

export const getPoolData = async (chainId, poolAddress, blockNumber) => {
  const variables = {
    poolAddresses: [poolAddress]
  }

  const query = prizePoolsQuery(blockNumber)

  let data
  try {
    data = await request(
      POOLTOGETHER_CURRENT_GRAPH_URIS[chainId],
      query,
      variables
    )
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data.prizePools
}
