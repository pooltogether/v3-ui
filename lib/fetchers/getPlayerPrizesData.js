import { request } from 'graphql-request'

import { POOLTOGETHER_SUBGRAPH_URIS } from 'lib/constants'
import { playerPrizesQuery } from 'lib/queries/playerPrizesQuery'

export const getPlayerPrizesData = async (chainId, playerAddress) => {
  const query = playerPrizesQuery()

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
