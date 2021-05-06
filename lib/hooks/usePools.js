import { useContext } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from 'react-query'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import {
  useCommunityPoolContracts,
  useGovernancePoolContracts,
  usePoolContractBySymbol
} from 'lib/hooks/usePoolContracts'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { getPool, getPoolsByChainId, getPoolsByChainIds } from 'lib/fetchers/getPools'
import { useRouterChainId } from 'lib/hooks/chainId/useRouterChainId'
import { useEnvChainIds } from 'lib/hooks/chainId/useEnvChainIds'
import { APP_ENVIRONMENT, useAppEnv } from 'lib/hooks/useAppEnv'
import { NETWORK } from 'lib/utils/networks'

/**
 * Fetches pool graph data, chain data, token prices, lootbox data & merges it all.
 * Returns a flat list of pools
 * @returns
 */
export const useAllPools = () => {
  const { data: poolsByChainId, ...useAllPoolsResponse } = useAllPoolsKeyedByChainId()
  const pools = poolsByChainId ? Object.values(poolsByChainId).flat() : null
  return { ...useAllPoolsResponse, data: pools }
}

/**
 * Fetches pool graph data, chain data, token prices, lootbox data & merges it all
 * @returns
 */
export const useAllPoolsKeyedByChainId = () => {
  const { pauseQueries } = useContext(AuthControllerContext)
  const queryClient = useQueryClient()

  const { appEnv } = useAppEnv()

  const ethereumChainId = appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.mainnet : NETWORK.rinkeby
  const polygonChainId = appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.matic : NETWORK.mumbai

  const enabled = !pauseQueries

  const { data: ethereumPools, ...ethereumUseQuery } = useQuery(
    getUsePoolsQueryKey(ethereumChainId),
    async () => await getPoolsByChainId(ethereumChainId),
    {
      enabled,
      onSuccess: (data) => populatePerPoolCache(ethereumChainId, queryClient, data),
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )

  const { data: polygonPools, ...polygonUseQuery } = useQuery(
    getUsePoolsQueryKey(polygonChainId),
    async () => await getPoolsByChainId(polygonChainId),
    {
      enabled,
      onSuccess: (data) => populatePerPoolCache(polygonChainId, queryClient, data),
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )

  const refetch = () => {
    ethereumUseQuery.refetch()
    polygonUseQuery.refetch()
  }
  const isFetched = ethereumUseQuery.isFetched && polygonUseQuery.isFetched
  const isFetching = ethereumUseQuery.isFetching && polygonUseQuery.isFetching
  let data = null
  if (ethereumUseQuery.isFetched) {
    if (!data) {
      data = {}
    }
    data[ethereumChainId] = ethereumPools
  }
  if (polygonUseQuery.isFetched) {
    if (!data) {
      data = {}
    }
    data[polygonChainId] = polygonPools
  }

  return { data, isFetched, isFetching, refetch }
}

/**
 *
 * @param {*} chainId
 * @param {*} poolAddress
 * @returns
 */
export const usePoolByChainId = (chainId, poolAddress) => {
  const { pauseQueries } = useContext(AuthControllerContext)

  const enabled = !pauseQueries && Boolean(poolAddress) && Boolean(chainId)
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
 * Populates the cache per chain id and per pool
 * @param {*} queryClient
 * @param {*} data
 * @returns
 */
const populatePerChainIdCache = (queryClient, data) => {
  Object.keys(data).forEach((chainId) => {
    const pools = data[chainId]
    queryClient.setQueryData(getUsePoolsByChainIdQueryKey(chainId), pools)
    populatePerPoolCache(chainId, queryClient, pools)
  })
}

/**
 * When the usePools query has returned, split the list of pools and
 * update cache for individual pools
 * @param {*} chainId
 * @param {*} queryClient
 * @param {*} pools
 * @returns
 */
const populatePerPoolCache = (chainId, queryClient, pools) =>
  pools.forEach((pool) => {
    queryClient.setQueryData(getUsePoolQueryKey(chainId, pool.prizePool.address), pool)
  })

// Variants

/**
 * Reads the route and looks for a symbol
 * @returns
 */
export const useCurrentPool = () => {
  const router = useRouter()
  const chainId = useRouterChainId()
  return usePoolBySymbol(chainId, router?.query?.symbol)
}

/**
 *
 * @param {*} poolAddress
 * @returns
 */
export const usePoolByAddress = (chainId, poolAddress) => {
  return usePoolByChainId(chainId, poolAddress)
}

/**
 *
 * @param {*} symbol
 * @returns
 */
export const usePoolBySymbol = (chainId, symbol) => {
  const poolContract = usePoolContractBySymbol(symbol)
  return usePoolByChainId(chainId, poolContract?.prizePool?.address)
}

/**
 *
 * @returns
 */
export const useGovernancePools = () => {
  const governanceContracts = useGovernancePoolContracts()
  const useAllPoolsData = useAllPoolsKeyedByChainId()

  console.log(useAllPoolsData.data)
  const pools = useAllPoolsData.data
    ? Object.values(filterPoolData(useAllPoolsData.data, governanceContracts)).flat()
    : null

  return {
    ...useAllPoolsData,
    data: pools
  }
}

/**
 *
 * @returns
 */
export const useCommunityPools = () => {
  const communityContracts = useCommunityPoolContracts()
  const useAllPoolsData = useAllPoolsKeyedByChainId()

  console.log(useAllPoolsData.data)
  const pools = useAllPoolsData.data
    ? Object.values(filterPoolData(useAllPoolsData.data, communityContracts)).flat()
    : null

  return {
    ...useAllPoolsData,
    data: pools
  }
}

// Utils

const filterPoolData = (data, contractsByChainId) =>
  Object.keys(data).reduce((filteredPoolsByChainId, chainId) => {
    const pools = data[chainId]
    const contracts = contractsByChainId[chainId]

    const filteredPools = []
    contracts.forEach((contract) => {
      const pool = pools.find((pool) => pool.prizePool.address === contract.prizePool.address)
      if (!pool) return
      filteredPools.push(pool)
    })

    filteredPoolsByChainId[chainId] = filteredPools
    return filteredPoolsByChainId
  }, {})

/**
 * Standardize the query key for use in cache population
 * @param {*} chainIds
 * @returns
 */
const getUsePoolsQueryKey = (chainIds) => [QUERY_KEYS.usePools, chainIds]

/**
 * Standardize the query key for use in cache population
 * @param {*} chainId
 * @returns
 */
const getUsePoolsByChainIdQueryKey = (chainId) => [QUERY_KEYS.usePoolsByChainId, chainId]

/**
 * Standardize the query key for use in cache population
 * @param {*} chainId
 * @param {*} poolAddress
 * @returns
 */
const getUsePoolQueryKey = (chainId, poolAddress) => [QUERY_KEYS.usePool, chainId, poolAddress]
