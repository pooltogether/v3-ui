import { request } from 'graphql-request'

import { PLAYER_PAGE_SIZE, POOLTOGETHER_GRAPH_URIS } from 'lib/constants'
import { controlledTokenBalancesQuery } from 'lib/queries/controlledTokenBalancesQuery'

export const getControlledTokenBalancesData = async (chainId, ticketAddress, blockNumber, skip) => {
  const query = controlledTokenBalancesQuery(blockNumber)

  const variables = {
    ticketAddress,
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

  return data?.controlledTokenBalances
}
