import { request } from 'graphql-request'

import { POOLTOGETHER_SUBGRAPH_URIS } from 'lib/constants'
import { playerQuery } from 'lib/queries/playerQuery'

export const getPlayerData = async (chainId, playerAddress, blockNumber) => {
  const query = playerQuery(blockNumber)

  const variables = {
    playerAddress,
  }

  let data
  try {
    data = await request(POOLTOGETHER_SUBGRAPH_URIS[chainId], query, variables)
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data
}
