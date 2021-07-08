import { fetchData } from 'lib/fetchers/fetchData'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { deserializeBigNumbers } from 'lib/utils/deserializeBigNumbers'

const API_URI = 'http://127.0.0.1:8787'

/**
 * Fetches the data for a single pool and converts big number data to BigNumbers
 * @param {*} chainId
 * @param {*} poolAddress
 * @returns
 */
export const getPool = async (chainId, poolAddress) =>
  await fetchData(`${API_URI}/pools/${chainId}/${poolAddress}.json`).then((pool) =>
    formatPool(pool, chainId)
  )

/**
 * Fetches the data for all pools and converts big number data to BigNumbers
 * @param {*} chainIds
 * @returns
 */
export const getPoolsByChainIds = async (chainIds) =>
  Promise.all(chainIds.map(async (chainId) => getPoolsByChainId(chainId))).then(keyPoolsByChainId)

/**
 * Fetches the data for all pools and converts big number data to BigNumbers
 * @param {*} chainId
 * @returns
 */
export const getPoolsByChainId = async (chainId) =>
  await fetchData(`${API_URI}/pools/${chainId}.json`).then((pools) =>
    pools.map((pool) => formatPool(pool, chainId))
  )

/**
 * Adds chain id and converts big numbers into BigNumbers
 * @param {*} pool
 * @param {*} chainId
 * @returns
 */
const formatPool = (pool, chainId) => ({
  chainId,
  incentivizesSponsorship: _determineIncentivization(pool),
  networkName: chainIdToNetworkName(chainId),
  ...deserializeBigNumbers(pool)
})

const _determineIncentivization = (pool) => {
  const sponsorshipAddress = pool.tokens.sponsorship.address.toLowerCase()

  const measureMatchesSponsorship = pool.tokenFaucets?.find((tokenFaucet) => {
    return tokenFaucet.measure.toLowerCase() === sponsorshipAddress
  })

  return Boolean(measureMatchesSponsorship)
}

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
