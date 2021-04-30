import { fetchData } from 'lib/fetchers/fetchData'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { deserializeBigNumbers } from 'lib/utils/deserializeBigNumbers'

const API_URI = 'http://127.0.0.1:8787'
// const API_URI = 'https://pooltogether-api.com'

/**
 * Fetches the data for a single pool and converts big number data to BigNumbers
 * @param {*} chainId
 * @param {*} poolAddress
 * @returns
 */
export const getPool = async (chainId, poolAddress) =>
  await fetchData(`${API_URI}/pools/${chainId}/${poolAddress}.json`).then((pool) => {
    console.log(formatPool(pool, chainId))
    return formatPool(pool, chainId)
  })

/**
 * Fetches the data for all pools and converts big number data to BigNumbers
 * @param {*} chainIds
 * @returns
 */
export const getPoolsByChainIds = async (chainIds) =>
  Promise.all(
    chainIds.map(
      async (chainId) =>
        await fetchData(`${API_URI}/pools/${chainId}.json`).then((pools) => {
          console.log(pools.map((pool) => formatPool(pool, chainId)))
          return pools.map((pool) => formatPool(pool, chainId))
        })
    )
  ).then(keyPoolsByChainId)

/**
 * Adds chain id and converts big numbers into BigNumbers
 * @param {*} pool
 * @param {*} chainId
 * @returns
 */
const formatPool = (pool, chainId) => ({
  chainId,
  networkName: chainIdToNetworkName(chainId),
  ...deserializeBigNumbers(pool)
})

/**
 * Keys the lists of pools by their chain id
 * @param {*} allPools
 * @returns
 */
const keyPoolsByChainId = (allPools) => {
  const arrayOfArrayOfPools = Object.values(allPools)
  return arrayOfArrayOfPools.reduce((sortedPools, pools) => {
    const chainId = pools?.[0].chainId
    if (chainId) {
      sortedPools[chainId] = pools
    }
    return sortedPools
  }, {})
}
