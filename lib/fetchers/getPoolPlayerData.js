import { request } from 'graphql-request'

import { POOLTOGETHER_GRAPH_URIS } from 'lib/constants'
import { playerQuery } from 'lib/queries/playerQuery'

export const getPoolPlayerData = async (chainId, poolAddress, playerAddress, blockNumber) => {
  const query = playerQuery(blockNumber)

  const variables = {
    playerId: `${poolAddress}-${playerAddress}`
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

  return data.player
}
