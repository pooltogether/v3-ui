import { getSubgraphClientByVersionFromContract } from 'lib/hooks/useSubgraphClients'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'
import { poolPrizeQuery } from 'lib/queries/poolPrizeQuery'

/**
 * Multiple prizes from a single pool, paginated
 * @param {*} chainId
 * @param {*} pool
 * @param {*} page
 * @param {*} pageSize
 * @returns
 */
export const getPoolPrizesData = async (chainId, pool, page, pageSize) => {
  const variables = {
    poolAddress: pool.prizePool.address,
    first: pageSize,
    skip: page * pageSize
  }

  const graphQLClient = getSubgraphClientByVersionFromContract(pool.contract, chainId)

  const query = poolPrizesQuery()

  let data
  try {
    data = await graphQLClient.request(query, variables)
  } catch (error) {
    console.error(error)
  }

  return data
}

/**
 * Single pool prize query
 * @param {*} chainId
 * @param {*} pool
 * @param {*} prizeNumber
 * @returns
 */
export const getPoolPrizeData = async (chainId, pool, prizeNumber) => {
  const variables = {
    poolAddress: pool.prizePool.address,
    prizeId: prizeNumber
  }

  const graphQLClient = getSubgraphClientByVersionFromContract(pool.contract, chainId)

  const query = poolPrizeQuery()

  let data
  try {
    data = await graphQLClient.request(query, variables)
  } catch (error) {
    console.error(error)
  }

  return data
}
