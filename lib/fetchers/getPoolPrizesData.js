import { PRIZE_PAGE_SIZE } from 'lib/constants'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'

export const getPoolPrizesData = async (
  graphQLClient,
  poolAddress,
  blockNumber,
  skip,
  pageSize
) => {
  const variables = {
    poolAddress,
    first: pageSize || PRIZE_PAGE_SIZE,
    skip
  }

  const query = poolPrizesQuery(blockNumber)

  let data
  try {
    data = await graphQLClient.request(query, variables)
  } catch (error) {
    console.error(error)
  }

  return data
}
