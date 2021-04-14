import { ethers } from 'ethers'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PRIZE_PAGE_SIZE } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { getPoolPrizeData, getPoolPrizesData } from 'lib/fetchers/getPoolPrizesData'
import { addBigNumbers, calculateTokenValues } from 'lib/fetchers/getPools'
import { useChainId } from 'lib/hooks/useChainId'
import { useCurrentPool } from 'lib/hooks/usePools'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { useQuery, useQueryClient } from 'react-query'

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
  const { pauseQueries } = useContext(AuthControllerContext)
  const chainId = useChainId()

  const poolAddress = pool?.prizePool?.address

  const { data: prizes, ...prizeData } = useQuery(
    [QUERY_KEYS.poolPrizesQuery, chainId, poolAddress, page, pageSize],
    async () => await getPoolPrizesData(chainId, pool?.contract, page, pageSize),
    {
      enabled: Boolean(!pauseQueries && poolAddress),
      keepPreviousData: true,
      onSuccess: (data) => populateCaches(chainId, poolAddress, queryClient, data)
    }
  )

  const addresses = getErc20AddressesByBlockNumberFromPrizes(
    prizes,
    pool?.tokens?.underlyingToken?.address
  )
  const { data: tokenPrices, ...tokenPricesData } = useTokenPrices(addresses)

  const count = pool?.prize?.currentPrizeId || 0
  const pages = Math.ceil(Number(count / PRIZE_PAGE_SIZE))
  const isFetched = prizeData.isFetched && tokenPricesData.isFetched
  const isFetching = prizeData.isFetching && tokenPricesData.isFetching

  const data = formatAndCalculatePrizeValues(prizes, tokenPrices, pool?.tokens?.underlyingToken)

  // console.log('Prize', data)

  return {
    data,
    isFetched,
    isFetching,
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
  const { pauseQueries } = useContext(AuthControllerContext)
  const chainId = useChainId()

  const poolContract = pool?.contract
  const poolAddress = poolContract?.prizePool?.address
  const underlyingToken = pool?.tokens?.underlyingToken

  const { data: prize, ...prizeData } = useQuery(
    getPrizeQueryKey(chainId, poolAddress, prizeNumber),
    async () => {
      return getPoolPrizeData(chainId, poolContract, prizeNumber)
    },
    {
      enabled: Boolean(!pauseQueries && poolAddress && prizeNumber && underlyingToken)
    }
  )

  const addresses = getErc20AddressesByBlockNumberFromPrizes([prize], underlyingToken?.address)
  const { data: tokenPrices, ...tokenPricesData } = useTokenPrices(addresses)

  const data = formatAndCalculatePrizeValues([prize], tokenPrices, underlyingToken)

  const isFetched = prizeData.isFetched && tokenPricesData.isFetched
  const isFetching = prizeData.isFetching && tokenPricesData.isFetching

  // console.log('Prize', data?.[0])

  return { data: data?.[0], isFetched, isFetching }
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
  prizes.forEach((prize) => {
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
  if (!prizes || prizes.filter(Boolean).length === 0 || !tokenPrices) return null

  return prizes.map((prize) => {
    const relevantPrices = tokenPrices[prize.awardedBlock]
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
  const yieldPrizeUnformatted = addBigNumbers(
    prize.awardedControlledTokens.map((token) => ethers.BigNumber.from(token.amount))
  )
  const underlyingTokenValueUsd = tokenPrices[underlyingToken.address].usd
  const yieldValues = calculateTokenValues(
    yieldPrizeUnformatted,
    underlyingTokenValueUsd,
    underlyingToken.decimals
  )
  prize.yield = yieldValues

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

  prize.totalValueUsdScaled = prize.external.totalValueUsdScaled.add(
    prize.yield.totalValueUsdScaled
  )
  prize.totalValueUsd = ethers.utils.formatUnits(prize.totalValueUsdScaled, 2)

  return prize
}
