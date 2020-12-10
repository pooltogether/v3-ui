import { request } from 'graphql-request'

import { POOLTOGETHER_CURRENT_GRAPH_URIS } from 'lib/constants'
import { poolDripsQuery } from 'lib/queries/poolDripsQuery'

export const getPoolDripsData = async (chainId, prizeStrategyAddress, blockNumber) => {
  const query = poolDripsQuery(blockNumber)

  const variables = {
    prizeStrategyAddress,
  }

  let data
  try {
    data = await request(
      POOLTOGETHER_CURRENT_GRAPH_URIS[chainId],
      query,
      variables
    )
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data
}
