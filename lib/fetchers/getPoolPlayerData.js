import { request } from 'graphql-request'

import { POOLTOGETHER_GRAPH_URIS } from 'lib/constants'
import { poolPlayerQuery } from 'lib/queries/poolPlayerQuery'

export const getPoolPlayerData = async (chainId, poolAddress, playerAddress, blockNumber) => {
  const query = poolPlayerQuery(blockNumber)

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
    console.log(data)
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data?.player
}
