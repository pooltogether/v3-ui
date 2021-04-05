import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useChainId } from 'lib/hooks/useChainId'
import {
  useCommunityPoolContracts,
  useGovernancePoolContracts,
  usePoolContracts
} from 'lib/hooks/usePoolContracts'
import { useQuery } from 'react-query'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { NO_REFETCH_QUERY_OPTIONS } from 'lib/constants'
import { getPoolData } from 'lib/fetchers/getPoolData'

// Variants

/**
 *
 * @param {*} poolAddress
 * @returns
 */
export const usePool = (poolAddress) => usePools([poolAddress])

/**
 *
 * @returns
 */
export const useGovernancePools = () => {
  const poolContracts = useGovernancePoolContracts()
  return usePools(poolContracts)
}

/**
 *
 * @returns
 */
export const useCommunityPools = () => {
  const poolContracts = useCommunityPoolContracts()
  return usePools(poolContracts)
}

/**
 *
 * @returns
 */
export const useAllPools = () => {
  const poolContracts = usePoolContracts()
  return usePools(poolContracts)
}

// Main pool data fetching hook

/**
 *
 * @param {*} poolContracts
 * @returns
 */
export const usePools = (poolContracts) => {
  const chainId = useChainId()
  const { pauseQueries } = useContext(AuthControllerContext)
  const { readProvider, isLoaded } = useReadProvider()

  const enabled = !pauseQueries && isLoaded

  return useQuery(
    [QUERY_KEYS.usePools, chainId, poolContracts],
    async () => await getPoolData(chainId, readProvider, poolContracts),
    {
      ...NO_REFETCH_QUERY_OPTIONS,
      enabled
    }
  )
}
