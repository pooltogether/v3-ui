import { request } from 'graphql-request'

import { PRIZE_PAGE_SIZE, POOLTOGETHER_CURRENT_GRAPH_URIS } from 'lib/constants'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'

export const getPoolPrizesData = async (chainId, poolAddress, blockNumber, skip) => {
  const variables = {
    poolAddress,
    first: PRIZE_PAGE_SIZE,
    skip,
  }

  const query = poolPrizesQuery(blockNumber)

  let data
  try {
    data = await request(POOLTOGETHER_CURRENT_GRAPH_URIS[chainId], query, variables)
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data
}
