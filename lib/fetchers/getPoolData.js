import merge from 'lodash.merge'
import { ethers } from 'ethers'
import { getTokenPriceData } from 'lib/fetchers/getTokenPriceData'
import { formatUnits } from 'ethers/lib/utils'

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
  const poolData = combinePoolData(poolGraphData, poolChainData)
  const erc20Addresses = getAllErc20Addresses(poolData)
  const tokenPriceGraphData = await getTokenPriceData(chainId, erc20Addresses)
  combineTokenPricesData(poolData, tokenPriceGraphData)
  calculateTotalPrizeValue(poolData)
  const tvl = calculateTotalValueLocked(poolData)
  return { pools: poolData, tvl }
}

/**
 * Merges poolGraphData & poolChainData
 * poolGraphData & poolChainData are pre-formatted
 * @param {*} poolGraphData
 * @param {*} poolChainData
 * @returns
 */
const combinePoolData = (poolGraphData, poolChainData) => {
  const pools = poolGraphData.map((pool) => {
    const chainData = poolChainData[pool.prizePool.address]
    return merge(pool, chainData)
  })
  return pools
}

/**
 * Gets all erc20 addresses related to a pool
 * @param {*} poolData
 * @returns Array of addresses
 */
const getAllErc20Addresses = (poolData) => {
  const addresses = new Set()
  poolData.forEach((pool) => {
    pool.prize.externalErc20Awards.forEach((erc20) => addresses.add(erc20.address))
    Object.values(pool.tokens).forEach((erc20) => addresses.add(erc20.address))
  })
  return [...addresses]
}

/**
 * Adds token price data to poolData
 * @param {*} poolData
 * @param {*} tokenPriceData
 */
const combineTokenPricesData = (poolData, tokenPriceData) => {
  poolData.forEach((pool) => {
    Object.values(pool.tokens).forEach((token) => {
      const priceData = tokenPriceData[token.address]
      if (priceData) {
        token.usd = tokenPriceData[token.address].usd
        token.derivedETH = tokenPriceData[token.address].derivedETH
        if (token.amountUnformatted) {
          token.valueUsdUnformatted = amountMultByUsd(token.amountUnformatted, token.usd)
          token.valueUsd = formatUnits(token.valueUsdUnformatted, token.decimals)
        }
      }
    })
  })
}

/**
 * Need to mult & div by 100 since BigNumber doesn't support decimals
 * @param {*} amount as a BigNumber
 * @param {*} usd as a Number
 */
const amountMultByUsd = (amount, usd) => amount.mul(Math.round(usd * 100)).div(100)

const calculateTotalPrizeValue = (poolData) => {
  poolData.forEach((pool) => {
    pool.prize.totalPrizeUsd = Object.values(pool.tokens).reduce((total, token) => {
      if (token.balanceUsdBN) {
        return total.add(token.balanceUsdBN)
      }
      return total
    }, ethers.constants.Zero)
  })
}

/**
 * Calculates & adds the tvl of each pool to poolData
 * Calculates the tvl of all pools
 * @param {*} poolData
 * @returns tvl of all pools
 */
function calculateTotalValueLocked(poolData) {
  poolData.forEach((pool) => {
    if (pool.tokens.underlyingToken.usd && pool.tokens.ticket.totalSupplyUnformatted) {
      const totalAmountDeposited = pool.tokens.ticket.totalSupplyUnformatted.add(
        pool.tokens.sponsorship.totalSupplyUnformatted
      )
      pool.prizePool.tvlUsdUnformatted = amountMultByUsd(
        totalAmountDeposited,
        pool.tokens.underlyingToken.usd
      )
      pool.prizePool.tvlUsd = formatUnits(
        pool.prizePool.tvlUsdUnformatted,
        pool.tokens.ticket.decimals
      )
    } else {
      pool.prizePool.tvlUsdUnformatted = ethers.constants.Zero
      pool.prizePool.tvlUsd = '0'
    }
  })

  return poolData.reduce((total, pool) => {
    if (pool.prizePool.tvlUsd) {
      return total.add(Math.round(pool.prizePool.tvlUsd))
    }
    return total
  }, ethers.constants.Zero)
}
