import { request } from 'graphql-request'

import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'
import { getPoolSubgraphUri } from 'lib/utils/getPoolSubgraphUri'

export const getPoolPrizesData = async (chainId, poolAddress, first, blockNumber) => {
  const poolSubgraphUri = getPoolSubgraphUri(chainId, blockNumber)
  
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
