import { request } from 'graphql-request'

import { prizePoolAccountQuery } from 'lib/queries/prizePoolAccountQuery'
import { getSubgraphUri } from 'lib/utils/getSubgraphUri'

export const getPrizePoolAccountData = async (chainId, poolAddress, playerAddress, blockNumber) => {
  const poolSubgraphUri = getSubgraphUri(chainId, blockNumber)

  const query = prizePoolAccountQuery(blockNumber)

  const variables = {
    id: `${poolAddress}-${playerAddress}`
  }

  let data
  try {
    data = await request(
      poolSubgraphUri,
      query,
      variables
    )
    console.log(data)
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data?.player
}
