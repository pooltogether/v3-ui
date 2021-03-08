import { playerQuery } from 'lib/queries/playerQuery'

export const getPlayerData = async (graphQLClient, playerAddress, blockNumber) => {
  const query = playerQuery(blockNumber)

  const variables = {
    playerAddress
  }

  let data
  try {
    data = await graphQLClient.request(query, variables)
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data
}
