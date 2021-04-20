import { fetchData } from 'lib/fetchers/fetchData'
import { deserializeBigNumbers } from 'lib/utils/deserializeBigNumbers'

/**
 * Fetches the data for a single pool and converts big number data to BigNumbers
 * @param {*} chainId
 * @param {*} poolAddress
 * @returns
 */
export const getPool = async (chainId, poolAddress) =>
  deserializeBigNumbers(
    await fetchData(`https://pooltogether-api.com/pools/${chainId}/${poolAddress}.json`)
  )

/**
 * Fetches the data for all pools and converts big number data to BigNumbers
 * @param {*} chainId
 * @returns
 */
export const getPools = async (chainId) =>
  deserializeBigNumbers(await fetchData(`https://pooltogether-api.com/pools/${chainId}.json`))
