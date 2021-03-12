import { poolQuery } from 'lib/queries/poolQuery'

export const getPoolData = async (graphQLClient, poolAddress, blockNumber) => {
  const variables = {
    poolAddress
  }

  const query = poolQuery(blockNumber)

  let data
  try {
    data = await graphQLClient.request(query, variables)
  } catch (error) {
    console.error(error)
  }

  return data.prizePool
}
