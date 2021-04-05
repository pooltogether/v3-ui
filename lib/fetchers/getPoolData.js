import deepmerge from 'deepmerge'

const { getPoolChainData } = require('lib/fetchers/getPoolChainData')
const { getPoolGraphData } = require('lib/fetchers/getPoolGraphData')

/**
 *
 * @param {*} chainId
 * @param {*} readProvider
 * @param {*} poolContracts
 * @returns
 */
export const getPoolData = async (chainId, readProvider, poolContracts) => {
  const poolGraphData = await getPoolGraphData(chainId, poolContracts)
  const poolChainData = await getPoolChainData(chainId, readProvider, poolContracts, poolGraphData)

  // TODO: Calculate any new fields ()
  return formatPoolData(poolGraphData, poolChainData)
}

const formatPoolData = (poolsGraphData, poolsChainData) => {
  const pools = poolsGraphData.map((pool) => {
    const poolChainData = poolsChainData[pool.prizePool.address]
    return deepmerge(pool, poolChainData)
  })
  console.log('pools', pools)
  return pools
}
