import { request } from 'graphql-request'

import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'
import { getSubgraphUri } from 'lib/utils/getSubgraphUri'

export const getPoolPrizesData = async (chainId, poolAddress, first, blockNumber) => {
  const poolSubgraphUri = getSubgraphUri(chainId, blockNumber)
  
  const variables = {
    poolAddress,
    first: (first && first !== -1) ? first : null
  }

  const query = poolPrizesQuery(blockNumber)

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
