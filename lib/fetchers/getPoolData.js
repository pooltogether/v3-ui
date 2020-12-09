import { request } from 'graphql-request'

import { timeTravelPoolsQuery } from 'lib/queries/timeTravelPoolsQuery'
import { getPoolSubgraphUri } from 'lib/utils/getPoolSubgraphUri'

export const getPoolData = async (chainId, poolAddress, blockNumber) => {
  const poolSubgraphUri = getPoolSubgraphUri(chainId, blockNumber)
  
  const variables = {
    ids: [poolAddress]
  }

  const query = timeTravelPoolsQuery(blockNumber)

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

  return data.timeTravelPrizePools
}
