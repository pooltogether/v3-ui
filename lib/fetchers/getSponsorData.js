import { request } from 'graphql-request'

import { POOLTOGETHER_GRAPH_URIS } from 'lib/constants'
import { sponsorQuery } from 'lib/queries/sponsorQuery'

export const getSponsorData = async (chainId, sponsorAddress, blockNumber) => {
  const query = sponsorQuery(blockNumber)

  const variables = {
    sponsorAddress,
  }

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

  return data?.sponsor
}
