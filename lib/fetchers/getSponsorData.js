import { request } from 'graphql-request'

import { sponsorQuery } from 'lib/queries/sponsorQuery'
import { getSubgraphUri } from 'lib/utils/getSubgraphUri'

export const getSponsorData = async (chainId, sponsorAddress, blockNumber) => {
  const poolSubgraphUri = getSubgraphUri(chainId, blockNumber)

  const query = sponsorQuery(blockNumber)

  const variables = {
    sponsorAddress,
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

  return data?.sponsor
}
