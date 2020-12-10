import { request } from 'graphql-request'

import { PLAYER_PAGE_SIZE } from 'lib/constants'
import { controlledTokenBalancesQuery } from 'lib/queries/controlledTokenBalancesQuery'
import { getSubgraphUri } from 'lib/utils/getSubgraphUri'

export const getControlledTokenBalancesData = async (chainId, ticketAddress, blockNumber, skip) => {
  const poolSubgraphUri = getSubgraphUri(chainId, blockNumber)

  const query = controlledTokenBalancesQuery(blockNumber)

  const variables = {
    ticketAddress,
    first: PLAYER_PAGE_SIZE,
    skip
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

  return data?.controlledTokenBalances
}
