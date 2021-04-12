import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PRIZE_PAGE_SIZE } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { getPoolPrizeData, getPoolPrizesData } from 'lib/fetchers/getPoolPrizesData'
import { useChainId } from 'lib/hooks/useChainId'
import { useCurrentPool } from 'lib/hooks/usePools'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'

/**
 * Fetches a page of past prizes for the given pool
 * @param {*} pageSize
 * @returns
 */
export const usePastPrizes = (pool, pageSize = PRIZE_PAGE_SIZE) => {
  const router = useRouter()
  const page = router.query?.page || 0
  const queryClient = useQueryClient()
  const { pauseQueries } = useContext(AuthControllerContext)
  const chainId = useChainId()

  const poolAddress = pool?.prizePool?.address

  const prizeData = useQuery(
    [QUERY_KEYS.poolPrizesQuery, chainId, poolAddress, page, pageSize],
    async () => {
      return getPoolPrizesData(chainId, pool, page, pageSize)
    },
    {
      enabled: Boolean(!pauseQueries && poolAddress),
      keepPreviousData: true,
      onSuccess: (data) => populateCaches(chainId, poolAddress, queryClient, data)
    }
  )

  const count = pool?.prize?.currentPrizeId || 0
  const pages = Math.ceil(Number(count / PRIZE_PAGE_SIZE))

  return {
    ...prizeData,
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

  const poolAddress = pool?.prizePool?.address

  return useQuery(
    getPrizeQueryKey(chainId, poolAddress, prizeNumber),
    async () => {
      return getPoolPrizeData(chainId, pool)
    },
    {
      enabled: Boolean(!pauseQueries && poolAddress)
    }
  )
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
  prizeNumber
]

/**
 * When the usePastPrize query has returned, split the list of prizes and
 * update cache for individual prizes
 * @param {*} chainId
 * @param {*} queryClient
 * @param {*} data
 * @returns
 */
const populateCaches = (chainId, poolAddress, queryClient, data) => {
  console.log(data)
  // Populate individual prize caches
  data.prizePool.prizes.forEach((prize) => {
    queryClient.setQueryData(
      getPrizeQueryKey(chainId, poolAddress, extractPrizeNumberFromPrize(prize)),
      prize
    )
  })
}
