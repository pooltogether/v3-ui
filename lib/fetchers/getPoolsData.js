import { prizePoolsQuery } from 'lib/queries/prizePoolsQuery'

export const getPoolsData = async (graphQLClient, poolAddresses, blockNumber) => {
  const variables = {
    poolAddresses
  }

  const query = prizePoolsQuery(blockNumber)

  let data
  try {
    data = await graphQLClient.request(query, variables)

    // TODO:
    // get uniswap token price
    // calculate totalUsdPrizeValue, etc here!
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data?.prizePools
}
