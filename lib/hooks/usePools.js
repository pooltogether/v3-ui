import { useContext } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from 'react-query'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useChainId } from 'lib/hooks/useChainId'
import {
  useCommunityPoolContracts,
  useGovernancePoolContracts,
  usePoolContractBySymbol
} from 'lib/hooks/usePoolContracts'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { getPool, getPools } from 'lib/fetchers/getPools'

/**
 * Fetches pool graph data, chain data, token prices, lootbox data & merges it all
 * @returns
 */
export const usePools = () => {
  const chainId = useChainId()
  const { pauseQueries } = useContext(AuthControllerContext)
  const queryClient = useQueryClient()

  const enabled = !pauseQueries
  return useQuery(getUsePoolsQueryKey(chainId), async () => await getPools(chainId), {
    enabled,
    onSuccess: (data) => populateCaches(chainId, queryClient, data),
    refetchInterval: MAINNET_POLLING_INTERVAL
  })
}

/**
 *
 * @param {*} poolAddress
 * @returns
 */
export const usePool = (poolAddress) => {
  const chainId = useChainId()
  const { pauseQueries } = useContext(AuthControllerContext)

  const enabled = !pauseQueries && Boolean(poolAddress)
  return useQuery(
    getUsePoolQueryKey(chainId, poolAddress),
    async () => await getPool(chainId, poolAddress),
    {
      enabled,
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}

/**
 * When the usePools query has returned, split the list of pools and
 * update cache for individual pools
 * @param {*} chainId
 * @param {*} queryClient
 * @param {*} data
 * @returns
 */
const populateCaches = (chainId, queryClient, data) => {
  // If there's just 1 pool, it's already populated by useQuery
  if (data.length === 1) return
  // Pre-populate individual pools
  data.forEach((pool) => {
    queryClient.setQueryData(getUsePoolQueryKey(chainId, pool.prizePool.address), pool)
  })
}

// Variants

/**
 * Reads the route and looks for a symbol
 * @returns
 */
export const useCurrentPool = () => {
  const router = useRouter()
  return usePoolBySymbol(router?.query?.symbol)
}

/**
 *
 * @param {*} poolAddress
 * @returns
 */
export const usePoolByAddress = (poolAddress) => {
  return usePool(poolAddress)
}

/**
 *
 * @param {*} symbol
 * @returns
 */
export const usePoolBySymbol = (symbol) => {
  const poolContract = usePoolContractBySymbol(symbol)
  return usePool(poolContract?.prizePool?.address)
}

/**
 *
 * @returns
 */
export const useGovernancePools = () => {
  const governanceContracts = useGovernancePoolContracts()
  const useAllPoolsData = useAllPools()
  return {
    ...useAllPoolsData,
    data: filterPoolData(useAllPoolsData.data, governanceContracts)
  }
}

/**
 *
 * @returns
 */
export const useCommunityPools = () => {
  const communityContracts = useCommunityPoolContracts()
  const useAllPoolsData = useAllPools()
  return {
    ...useAllPoolsData,
    data: filterPoolData(useAllPoolsData.data, communityContracts)
  }
}

/**
 *
 * @returns
 */
export const useAllPools = () => {
  return usePools()
}

// Utils

const filterPoolData = (data, contracts) =>
  contracts
    .map((contract) => {
      const pool = data?.find((pool) => pool.prizePool.address === contract.prizePool.address)
      if (pool) {
        return pool
      }
      return null
    })
    .filter(Boolean)

/**
 * Standardize the query key for use in cache population
 * @param {*} chainId
 * @returns
 */
const getUsePoolsQueryKey = (chainId) => [QUERY_KEYS.usePools, chainId]

/**
 * Standardize the query key for use in cache population
 * @param {*} chainId
 * @param {*} poolAddress
 * @returns
 */
const getUsePoolQueryKey = (chainId, poolAddress) => [QUERY_KEYS.usePool, chainId, poolAddress]
