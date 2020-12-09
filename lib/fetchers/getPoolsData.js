import { request } from 'graphql-request'

import { prizePoolsQuery } from 'lib/queries/prizePoolsQuery'
import { getPoolSubgraphUri } from 'lib/utils/getPoolSubgraphUri'

export const getPoolsData = async (chainId, contractAddresses, blockNumber) => {
  const poolSubgraphUri = getPoolSubgraphUri(chainId, blockNumber)
  
  const variables = {
    poolAddresses: contractAddresses.pools
  }
  const query = prizePoolsQuery(blockNumber)

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

  return data?.prizePools
}
