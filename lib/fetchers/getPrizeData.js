import { request } from 'graphql-request'

import { prizeQuery } from 'lib/queries/prizeQuery'
import { getSubgraphUri } from 'lib/utils/getSubgraphUri'

export const getPrizeData = async (chainId, poolAddress, prizeId, blockNumber) => {
  const poolSubgraphUri = getSubgraphUri(chainId, blockNumber)
  
  const variables = {
    poolAddress,
    prizeId,
  }

  const query = prizeQuery(blockNumber)

  let data
  try {
    data = await request(
      poolSubgraphUri,
      query,
      variables
    )
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data
}
