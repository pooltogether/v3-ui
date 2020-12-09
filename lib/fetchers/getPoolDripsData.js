import { request } from 'graphql-request'

import { poolDripsQuery } from 'lib/queries/poolDripsQuery'
import { getPoolSubgraphUri } from 'lib/utils/getPoolSubgraphUri'

export const getPoolDripsData = async (chainId, prizeStrategyAddress, blockNumber) => {
  const poolSubgraphUri = getPoolSubgraphUri(chainId, blockNumber)

  const query = poolDripsQuery(blockNumber)

  const variables = {
    prizeStrategyAddress,
  }

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
