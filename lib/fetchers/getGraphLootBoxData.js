import { lootBoxQuery } from 'lib/queries/lootBoxQuery'

export const getGraphLootBoxData = async (graphQLClient, lootBoxAddress, tokenId, blockNumber) => {
  const variables = {
    lootBoxAddress,
    tokenId
  }

  const query = lootBoxQuery(blockNumber)

  let response
  try {
    response = await graphQLClient.request(query, variables)
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return response
}
