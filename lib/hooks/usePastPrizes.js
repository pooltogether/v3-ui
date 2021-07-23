import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from 'react-query'

import { PRIZE_PAGE_SIZE } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { getPoolPrizeData, getPoolPrizesData } from 'lib/fetchers/getPoolPrizesData'
import { addBigNumbers, calculateTokenValues } from 'lib/utils/poolDataUtils'
import { useCurrentPool } from 'lib/hooks/usePools'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'
import { useReadProvider } from 'lib/hooks/providers/useReadProvider'

/**
 * Handles reading the page from the router for you!
 * @param {*} pool
 * @param {*} pageSize
 * @returns
 */
export const usePaginatedPastPrizes = (pool, pageSize = PRIZE_PAGE_SIZE) => {
  const router = useRouter()
  const page = Number(router.query?.page) || 1
  return usePastPrizes(pool, page, pageSize)
}

/**
 * Fetches a page of past prizes for the given pool
 * @param {*} pageSize
 * @returns
 */
export const usePastPrizes = (pool, page, pageSize = PRIZE_PAGE_SIZE) => {
  const queryClient = useQueryClient()
  const chainId = pool?.chainId
  const { data: readProvider, isFetched: readProviderReady } = useReadProvider(chainId)

  const poolAddress = pool?.prizePool?.address

  const { data: prizes, ...prizeData } = useQuery(
    [QUERY_KEYS.poolPrizesQuery, chainId, poolAddress, page, pageSize],
    async () => await getPoolPrizesData(chainId, readProvider, pool?.contract, page, pageSize),
    {
      enabled: Boolean(poolAddress && readProviderReady && chainId),
      keepPreviousData: true,
      onSuccess: (data) => populateCaches(chainId, poolAddress, queryClient, data)
    }
  )

  const addresses = getErc20AddressesByBlockNumberFromPrizes(
    prizes,
    pool?.tokens?.underlyingToken?.address
  )
  const { data: tokenPrices, ...tokenPricesData } = useTokenPrices(chainId, addresses)

  const count = pool?.prize?.currentPrizeId || 0
  const pages = Math.ceil(Number(count / PRIZE_PAGE_SIZE))
  const isFetched =
    (prizeData.isFetched && tokenPricesData.isFetched) ||
    (prizeData.isFetched && Boolean(prizes?.length === 0))

  const data = formatAndCalculatePrizeValues(prizes, tokenPrices, pool?.tokens?.underlyingToken)

  return {
    data,
    isFetched,
    page,
    pages,
    count
  }
}

// Variants

/**
 * Fetches the prize data for a specific prize
 * @param {*} pool
 * @param {*} prizeNumber
 * @returns
 */
export const usePastPrize = (pool, prizeNumber) => {
  const chainId = pool?.chainId
  const { data: readProvider, isFetched: providerIsLoaded } = useReadProvider(chainId)

  const poolContract = pool?.contract
  const poolAddress = poolContract?.prizePool?.address
  const underlyingToken = pool?.tokens?.underlyingToken

  const { data: prize, ...prizeData } = useQuery(
    getPrizeQueryKey(chainId, poolAddress, prizeNumber),
    async () => {
      return getPoolPrizeData(chainId, readProvider, poolContract, prizeNumber)
    },
    {
      enabled: Boolean(poolAddress && prizeNumber && underlyingToken && providerIsLoaded && chainId)
    }
  )

  const addresses = getErc20AddressesByBlockNumberFromPrizes([prize], underlyingToken?.address)
  const { data: tokenPrices, ...tokenPricesData } = useTokenPrices(chainId, addresses)

  const data = formatAndCalculatePrizeValues([prize], tokenPrices, underlyingToken)

  const isFetched = prizeData.isFetched && tokenPricesData.isFetched

  return { data: data?.[0], isFetched }
}

/**
 * Fetches a page of past prizes for the current pool
 * @returns
 */
export const usePastPrizesOfCurrentPool = () => {
  const { data: pool } = useCurrentPool()
  return usePastPrizes(pool)
}

// Utils

/**
 * Standardized key for the cache
 * @param {*} chainId
 * @param {*} poolAddress
 * @param {*} prizeNumber
 * @returns
 */
const getPrizeQueryKey = (chainId, poolAddress, prizeNumber) => [
  QUERY_KEYS.poolPrizeQuery,
  chainId,
  poolAddress,
  Number(prizeNumber)
]

/**
 * When the usePastPrize query has returned, split the list of prizes and
 * update cache for individual prizes
 * @param {*} chainId
 * @param {*} queryClient
 * @param {*} data
 * @returns
 */
const populateCaches = (chainId, poolAddress, queryClient, prizes) => {
  // Populate individual prize caches
  prizes?.forEach((prize) => {
    queryClient.setQueryData(
      getPrizeQueryKey(chainId, poolAddress, extractPrizeNumberFromPrize(prize)),
      prize
    )
  })
}

/**
 * Formats into lists of erc20 addresses keyed by block numbers
 * @param {*} prizes
 */
const getErc20AddressesByBlockNumberFromPrizes = (prizes, underlyingTokenAddress) => {
  if (!prizes || prizes.filter(Boolean).length === 0) return null

  const addresses = {}
  prizes.forEach((prize) => {
    const tokenAddresses = new Set([underlyingTokenAddress])
    const blockNumber = prize.awardedBlock
    prize.awardedExternalErc20Tokens.forEach((token) => tokenAddresses.add(token.address))
    prize.lootBox?.erc20Tokens?.forEach((token) => tokenAddresses.add(token.address))
    addresses[blockNumber] = [...tokenAddresses]
  })

  return addresses
}

/**
 * Calls formatAndCalculatePrizeValue for all prizes
 * @param {*} prizes
 * @param {*} tokenPrices
 */
const formatAndCalculatePrizeValues = (prizes, tokenPrices, underlyingToken) => {
  if (!prizes || prizes.filter(Boolean).length === 0 || !tokenPrices || !underlyingToken) {
    return null
  }

  return prizes.map((prize) => {
    const relevantPrices = tokenPrices[prize.awardedBlock]

    // this state can happen when a prize is being awarded
    // the graph gets messed up for this 5 - 10 minutes
    // could improve on the fix by not passing the new prize object
    // that hasn't completed being awarded yet
    if (!relevantPrices) {
      return {}
    }
    return formatAndCalculatePrizeValue(prize, relevantPrices, underlyingToken)
  })
}

/**
 * Formats prizes and calculated prize values
 * @param {*} _prize
 * @param {*} tokenPrices
 * @param {*} underlyingToken
 * @returns
 */
const formatAndCalculatePrizeValue = (_prize, tokenPrices, underlyingToken) => {
  const prize = { ..._prize, id: extractPrizeNumberFromPrize(_prize) }

  // Yield
  const yieldPrizeUnformatted = addBigNumbers(
    prize.awardedControlledTokens.map((token) => ethers.BigNumber.from(token.amount))
  )
  const underlyingTokenValueUsd = tokenPrices[underlyingToken?.address]?.usd || '0'
  const yieldValues = calculateTokenValues(
    yieldPrizeUnformatted,
    underlyingTokenValueUsd,
    underlyingToken.decimals
  )
  prize.yield = yieldValues

  // External ERC20 prizes
  prize.awardedExternalErc20Tokens = prize.awardedExternalErc20Tokens.map((token) => {
    const tokenPrice = tokenPrices[token.address]
    const tokenUsd = tokenPrice?.usd || '0'
    const tokenValues = calculateTokenValues(
      ethers.BigNumber.from(token.balanceAwarded),
      tokenUsd,
      token.decimals
    )
    return {
      ...token,
      ...tokenValues
    }
  })

  const externalErc20UsdValuesScaled = prize.awardedExternalErc20Tokens.map(
    (token) => token.totalValueUsdScaled
  )
  prize.external = { totalValueUsdScaled: addBigNumbers(externalErc20UsdValuesScaled) }
  prize.external.totalValueUsd = ethers.utils.formatUnits(prize.external.totalValueUsdScaled, 2)

  // LootBox
  if (prize.lootBox?.id) {
    prize.lootBox.erc20Tokens = prize.lootBox.erc20Tokens.map((token) => {
      const tokenPrice = tokenPrices[token.address]
      const tokenUsd = tokenPrice?.usd || '0'
      const tokenValues = calculateTokenValues(token.amountUnformatted, tokenUsd, token.decimals)
      return {
        ...token,
        ...tokenValues
      }
    })

    const lootBoxErc20UsdValuesScaled = prize.lootBox.erc20Tokens.map(
      (token) => token.totalValueUsdScaled
    )
    prize.lootBox.totalValueUsdScaled = addBigNumbers(lootBoxErc20UsdValuesScaled)
    prize.lootBox.totalValueUsd = ethers.utils.formatUnits(prize.lootBox.totalValueUsdScaled, 2)
  }

  prize.totalValueUsdScaled = prize.external.totalValueUsdScaled.add(
    prize.yield.totalValueUsdScaled
  )
  if (prize.lootBox?.id) {
    prize.totalValueUsdScaled = prize.totalValueUsdScaled.add(prize.lootBox.totalValueUsdScaled)
  }
  prize.totalValueUsd = ethers.utils.formatUnits(prize.totalValueUsdScaled, 2)

  return prize
}
