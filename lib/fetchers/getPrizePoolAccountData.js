import { request } from 'graphql-request'

import { POOLTOGETHER_SUBGRAPH_URIS } from 'lib/constants'
import { prizePoolAccountQuery } from 'lib/queries/prizePoolAccountQuery'

export const getPrizePoolAccountData = async (chainId, poolAddress, playerAddress, blockNumber) => {
  const query = prizePoolAccountQuery(blockNumber)

  const variables = {
    id: `${poolAddress}-${playerAddress}`
  }

  let data
  try {
    data = await request(POOLTOGETHER_SUBGRAPH_URIS[chainId], query, variables)
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data?.prizePoolAccount
}
