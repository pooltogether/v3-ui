import { PLAYER_PAGE_SIZE } from 'lib/constants'
import { controlledTokenBalancesQuery } from 'lib/queries/controlledTokenBalancesQuery'

export const getControlledTokenBalancesData = async (
  graphQLClient,
  ticketAddress,
  blockNumber,
  skip
) => {
  const query = controlledTokenBalancesQuery(blockNumber)

  const variables = {
    ticketAddress,
    first: PLAYER_PAGE_SIZE,
    skip
  }

  let data
  try {
    data = await graphQLClient.request(query, variables)
  } catch (error) {
    console.error(error)
  }

  return data?.controlledTokenBalances
}
