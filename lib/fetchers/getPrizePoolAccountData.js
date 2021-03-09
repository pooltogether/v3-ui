import { prizePoolAccountQuery } from 'lib/queries/prizePoolAccountQuery'

export const getPrizePoolAccountData = async (
  graphQLClient,
  poolAddress,
  playerAddress,
  blockNumber
) => {
  const query = prizePoolAccountQuery(blockNumber)

  const variables = {
    id: `${poolAddress}-${playerAddress}`
  }

  let data
  try {
    data = await graphQLClient.request(query, variables)
  } catch (error) {
    console.error(error)
  }

  return data?.prizePoolAccount
}
