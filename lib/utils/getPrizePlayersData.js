import { request } from 'graphql-request'

import { PLAYER_PAGE_SIZE, POOLTOGETHER_GRAPH_URIS } from 'lib/constants'
import { prizePlayersQuery } from 'lib/queries/prizePlayersQuery'

export const getPrizePlayersData = async (chainId, poolAddress, blockNumber, skip) => {
  const query = prizePlayersQuery(blockNumber)

  const variables = {
    prizePoolAddress: poolAddress,
    first: PLAYER_PAGE_SIZE,
    skip
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

  return data.players
}
