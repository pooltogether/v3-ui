import { request } from 'graphql-request'

import { POOLTOGETHER_GRAPH_URIS } from 'lib/constants'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'

export const getPoolPrizesData = async (chainId, poolAddress, first, blockNumber) => {
  const variables = {
    poolAddress,
    first: (first && first !== -1) ? first : null
  }

  const query = poolPrizesQuery(blockNumber)

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

  return data
}
