import { request } from 'graphql-request'

import { POOLTOGETHER_GRAPH_URIS } from 'lib/constants'
import { prizeQuery } from 'lib/queries/prizeQuery'

export const getPrizeData = async (chainId, poolAddress, prizeId, blockNumber) => {
  const variables = {
    poolAddress,
    prizeId,
  }

  const query = prizeQuery(blockNumber)

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
