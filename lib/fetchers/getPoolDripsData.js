import { request } from 'graphql-request'

import { POOLTOGETHER_CURRENT_GRAPH_URIS } from 'lib/constants'
import { poolDripsQuery } from 'lib/queries/poolDripsQuery'

export const getPoolDripsData = async (chainId, blockNumber) => {
  const query = poolDripsQuery(blockNumber)

  const variables = {
    addresses: [
      '0xc7c406a867b324b9189b9a7503683efc9bdce5ba', // old prize strat
      '0x2f6e61d89d43b3ada4a909935ee05d8ca8db78de'  // new prize strat thru shim
    ], 
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
