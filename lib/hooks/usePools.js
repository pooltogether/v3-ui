import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useChainId } from 'lib/hooks/useChainId'
import {
  useCommunityPoolContracts,
  useGovernancePoolContracts,
  usePoolContract,
  usePoolContractBySymbol,
  usePoolContracts
} from 'lib/hooks/usePoolContracts'
import { useQuery, useQueryClient } from 'react-query'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { getPools } from 'lib/fetchers/getPools'
import { useRouter } from 'next/router'

// Variants

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
  const poolContract = usePoolContract(poolAddress)
  return usePool(poolContract)
}

/**
 *
 * @param {*} label
 * @returns
 */
export const usePoolBySymbol = (label) => {
  const poolContract = usePoolContractBySymbol(label)
  return usePool(poolContract)
}

const usePool = (poolContract) => {
  const usePoolData = usePools([poolContract])
  return { ...usePoolData, data: usePoolData?.data?.[0] }
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
 *
 * @returns
 */
export const useAllPools = () => {
  const poolContracts = usePoolContracts()
  return usePools(poolContracts)
}

/**
 *
 * @param {*} poolContracts
 * @returns
 */
export const usePools = (poolContracts) => {
  const chainId = useChainId()
  const { pauseQueries } = useContext(AuthControllerContext)
  const { readProvider, isLoaded } = useReadProvider()
  const queryClient = useQueryClient()

  const contracts = poolContracts.filter(Boolean)

  const enabled = !pauseQueries && isLoaded && contracts.length > 0
  return useQuery(
    getUsePoolQueryKey(chainId, contracts),
    async () => await getPools(chainId, readProvider, contracts),
    {
      enabled,
      onSuccess: (data) => populateCaches(chainId, queryClient, data, contracts)
    }
  )
}

/**
 * Standardize the query key for use in cache population
 * @param {*} chainId
 * @param {*} contracts
 * @returns
 */
const getUsePoolQueryKey = (chainId, contracts) => [QUERY_KEYS.usePools, chainId, contracts]

/**
 * When the usePools query has returned, split the list of pools and
 * update cache for individual pools
 * @param {*} chainId
 * @param {*} queryClient
 * @param {*} data
 * @param {*} contracts
 * @returns
 */
const populateCaches = (chainId, queryClient, data, contracts) => {
  // If there's just 1 pool, it's already populated by useQuery
  if (data.length === 1) return
  // Pre-populate individual pools
  data.forEach((pool) => {
    const contract = contracts.find(
      (contract) => contract.prizePool.address === pool.prizePool.address
    )
    queryClient.setQueryData(getUsePoolQueryKey(chainId, [contract]), [pool])
  })
}
