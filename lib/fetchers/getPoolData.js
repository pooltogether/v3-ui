import merge from 'lodash.merge'
import cloneDeep from 'lodash.clonedeep'
import { ethers } from 'ethers'
import { getTokenPriceData } from 'lib/fetchers/getTokenPriceData'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { PRIZE_POOL_TYPES } from 'lib/constants'
import { calculateEstimatedPoolPrize } from 'lib/services/calculateEstimatedPoolPrize'
import { getGraphLootBoxData } from 'lib/fetchers/getGraphLootBoxData'
import { stringWithPrecision } from 'lib/utils/stringWithPrecision'

const { getPoolChainData } = require('lib/fetchers/getPoolChainData')
const { getPoolGraphData } = require('lib/fetchers/getPoolGraphData')

const bn = ethers.BigNumber.from

// TODO: Block list for erc20's const MY_CRYPTO_MEMBERSHIP_ADDRESS = '0x6ca105d2af7095b1bceeb6a2113d168dddcd57cf'

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
  let poolData = combinePoolData(poolGraphData, poolChainData)
  console.log(poolData)
  const lootBoxData = await getGraphLootBoxData(chainId, poolData)
  poolData = combineLootBoxData(poolData, lootBoxData)
  const erc20Addresses = getAllErc20Addresses(poolData)
  const tokenPriceGraphData = await getTokenPriceData(chainId, erc20Addresses)
  poolData = combineTokenPricesData(poolData, tokenPriceGraphData)
  poolData = calculateTotalPrizeValuePerPool(poolData)
  poolData = calculateTotalValueLockedPerPool(poolData)
  poolData = addPoolMetadata(poolData, poolContracts)
  console.log('final', poolData)
  return poolData
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
 *
 * @param {*} poolData
 * @param {*} lootBoxData
 * @returns
 */
const combineLootBoxData = (poolData, lootBoxData) => {
  poolData.forEach((pool) => {
    if (pool.prize?.lootBox?.tokenIds?.length > 0) {
      pool.prize.lootBox.contents = lootBoxData.lootBoxes.map((lootBox) => ({
        // ...lootBox,
        address: lootBox.id,
        tokenId: lootBox.tokenId,
        erc1155Tokens: lootBox.erc1155Balance,
        erc721Tokens: lootBox.erc721Tokens,
        erc20Tokens: lootBox.erc20Balances.map((erc20) => ({
          ...erc20.erc20Entity,
          address: erc20.erc20Entity.id,
          amountUnformatted: bn(erc20.balance),
          amount: formatUnits(erc20.balance, erc20.erc20Entity.balance)
        }))
      }))
    }
  })

  return poolData
}

/**
 * Gets all erc20 addresses related to a pool
 * @param {*} poolData
 * @returns Array of addresses
 */
const getAllErc20Addresses = (poolData) => {
  const addresses = new Set()
  poolData.forEach((pool) => {
    // Get external erc20s
    pool.prize.externalErc20Awards.forEach((erc20) => addresses.add(erc20.address))
    // Get lootbox erc20s
    pool.prize.lootBox.contents?.forEach((box) =>
      box.erc20Tokens.forEach((erc20) => addresses.add(erc20.address))
    )
    // Get known tokens
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
  /**
   * Adds token USD value if we have the USD price per token
   * @param {*} token
   */
  const addTokenTotalUsdValue = (token) => {
    const priceData = tokenPriceData[token.address]
    if (priceData) {
      token.usd = tokenPriceData[token.address].usd
      token.derivedETH = tokenPriceData[token.address].derivedETH
      if (token.amount) {
        const usdValueUnformatted = amountMultByUsd(token.amountUnformatted, token.usd)
        token.valueUsd = formatUnits(usdValueUnformatted, token.decimals)
        token.valueUsdScaled = toScaledUsdBigNumber(token.valueUsd)
      }
    }
  }

  poolData.forEach((pool) => {
    // Add to all known tokens
    Object.values(pool.tokens).forEach(addTokenTotalUsdValue)
    // Add to all external erc20 tokens
    Object.values(pool.prize.externalErc20Awards).forEach(addTokenTotalUsdValue)
    // Add to all lootBox tokens
    pool.prize?.lootBox?.contents.forEach((box) => box.erc20Tokens.forEach(addTokenTotalUsdValue))
  })

  return poolData
}

/**
 * Need to mult & div by 100 since BigNumber doesn't support decimals
 * @param {*} amount as a BigNumber
 * @param {*} usd as a Number
 * @returns a BigNumber
 */
const amountMultByUsd = (amount, usd) => amount.mul(Math.round(usd * 100)).div(100)

/**
 * Calculate total prize value
 * Estimate final prize if yield is compound
 * NOTE: Scaled math that adds the USD value of a token if it is available, so .div(100)
 * Total prize is:
 *  External award values
 *  + LootBox value
 *  + Estimated Yield by end of prize period (or just current balance if we can't estimate)
 * @param {*} poolData
 */
const calculateTotalPrizeValuePerPool = (poolData) => {
  poolData.forEach((pool) => {
    // Calculate external award value
    const externalErc20TotalValueUsdScaled = Object.values(pool.prize.externalErc20Awards).reduce(
      addScaledTokenValueToTotal,
      ethers.constants.Zero
    )
    pool.prize.erc20Awards = {
      totalValueUsdScaled: externalErc20TotalValueUsdScaled,
      totalValueUsd: formatUnits(externalErc20TotalValueUsdScaled, 2)
    }

    // Calculate lootBox award value
    const lootBoxTotalValueUsdScaled =
      pool.prize.lootBox?.contents?.reduce((total, box) => {
        if (box.erc20Tokens.length > 0) {
          return total.add(
            box.erc20Tokens.reduce(addScaledTokenValueToTotal, ethers.constants.Zero)
          )
        }
        return total
      }, ethers.constants.Zero) || ethers.constants.Zero

    pool.prize.lootBox = {
      ...pool.prize.lootBox,
      totalValueUsdScaled: lootBoxTotalValueUsdScaled,
      totalValueUsd: formatUnits(lootBoxTotalValueUsdScaled, 2)
    }

    // Calculate yield prize
    const yieldAmount = stringWithPrecision(
      calculateEstimatedPoolPrize({
        ticketSupply: pool.tokens.ticket.totalSupplyUnformatted,
        totalSponsorship: pool.tokens.sponsorship.totalSupplyUnformatted,
        awardBalance: pool.prize.amountUnformatted,
        underlyingCollateralDecimals: pool.tokens.underlyingToken.decimals,
        supplyRatePerBlock: pool.tokens.cToken?.supplyRatePerBlock,
        prizePeriodRemainingSeconds: pool.prize.prizePeriodRemainingSeconds
      }),
      { precision: pool.tokens.underlyingToken.decimals - 1 }
    )
    pool.prize.yield = {
      amount: yieldAmount
    }
    pool.prize.yield.amountUnformatted = parseUnits(
      pool.prize.yield.amount,
      pool.tokens.underlyingToken.decimals
    )
    const yieldTotalValueUnformatted = pool.tokens.underlyingToken.usd
      ? amountMultByUsd(pool.prize.yield.amountUnformatted, pool.tokens.underlyingToken.usd)
      : ethers.constants.Zero
    pool.prize.yield.totalValueUsd = formatUnits(
      yieldTotalValueUnformatted,
      pool.tokens.underlyingToken.decimals
    )
    pool.prize.yield.totalValueUsdScaled = toScaledUsdBigNumber(pool.prize.yield.totalValueUsd)

    // Calculate total
    pool.prize.totalValueUsdScaled = addBigNumbers([
      pool.prize.yield.totalValueUsdScaled,
      pool.prize.lootBox.totalValueUsdScaled,
      pool.prize.erc20Awards.totalValueUsdScaled
    ])
    pool.prize.totalValueUsd = formatUnits(pool.prize.totalValueUsdScaled, 2)
  })

  return poolData
}

/**
 * Adds a list of BigNumbers
 * @param {*} totals an array of scaled BigNumbers, specifically USD values
 * @returns
 */
const addBigNumbers = (totals) =>
  totals.reduce((total, usdScaled) => {
    return usdScaled.add(total)
  }, ethers.constants.Zero)

/**
 * Scaled math that adds the USD value of a token if it is available
 * Math is done scaled up to keep the value of the cents when using BigNumbers
 * @param {*} total
 * @param {*} token
 * @returns
 */
const addScaledTokenValueToTotal = (total, token) => {
  if (token.valueUsdScaled) {
    return total.add(token.valueUsdScaled)
  }
  return total
}

/**
 * Converts a USD string to a scaled up big number to account for cents
 * @param {*} usdValue a String ex. "100.23"
 * @returns a BigNumber ex. 10023
 */
const toScaledUsdBigNumber = (usdValue) => {
  return parseUnits(stringWithPrecision(usdValue, { precision: 2 }), 2)
}

/**
 * Calculates & adds the tvl of each pool to poolData
 * Calculates the tvl of all pools
 * @param {*} poolData
 * @returns tvl of all pools
 */
const calculateTotalValueLockedPerPool = (poolData) => {
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
  return poolData
}

/**
 * Adds contract metadata to the pools
 * @param {*} poolData
 * @param {*} poolContracts
 */
const addPoolMetadata = (poolData, poolContracts) => {
  poolContracts.forEach((contract) => {
    const pool = poolData.find((pool) => pool.prizePool.address === contract.prizePool.address)
    if (!pool) return
    pool.name = `${pool.tokens.underlyingToken.symbol} Pool`
    merge(pool, contract)
  })
  return poolData
}
