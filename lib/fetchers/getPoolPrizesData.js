import { PRIZE_PAGE_SIZE } from 'lib/constants'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'

export const getPoolPrizesData = async (graphQLClient, poolAddress, blockNumber, skip) => {
  const variables = {
    poolAddress,
    first: PRIZE_PAGE_SIZE,
    skip
  }

  const query = poolPrizesQuery(blockNumber)

  let data
  try {
    data = await graphQLClient.request(query, variables)
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data
}
