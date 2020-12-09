import { request } from 'graphql-request'

import { sponsorQuery } from 'lib/queries/sponsorQuery'
import { getPoolSubgraphUri } from 'lib/utils/getPoolSubgraphUri'

export const getSponsorData = async (chainId, sponsorAddress, blockNumber) => {
  const poolSubgraphUri = getPoolSubgraphUri(chainId, blockNumber)

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
