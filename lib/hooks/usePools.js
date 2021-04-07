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

/**
 *
 * @param {*} poolContracts
 * @returns
 */
export const usePools = (poolContracts) => {
  const chainId = useChainId()
  const { pauseQueries } = useContext(AuthControllerContext)
  const { readProvider, isLoaded } = useReadProvider()

  const contracts = poolContracts.filter(Boolean)

  const enabled = !pauseQueries && isLoaded && contracts.length > 0

  return useQuery(
    [QUERY_KEYS.usePools, chainId, contracts],
    async () => await getPoolData(chainId, readProvider, contracts),
    {
      ...NO_REFETCH_QUERY_OPTIONS,
      enabled
    }
  )
}
