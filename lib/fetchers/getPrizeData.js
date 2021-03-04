import { prizeQuery } from 'lib/queries/prizeQuery'

export const getPrizeData = async (graphQLClient, poolAddress, prizeId, blockNumber) => {
  const variables = {
    poolAddress,
    prizeId
  }

  const query = prizeQuery(blockNumber)

  let data
  try {
    data = await graphQLClient.request(query, variables)
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data
}
