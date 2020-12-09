import { request } from 'graphql-request'

import { prizeQuery } from 'lib/queries/prizeQuery'
import { getPoolSubgraphUri } from 'lib/utils/getPoolSubgraphUri'

export const getPrizeData = async (chainId, poolAddress, prizeId, blockNumber) => {
  const poolSubgraphUri = getPoolSubgraphUri(chainId, blockNumber)
  
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
