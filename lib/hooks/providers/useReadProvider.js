import { useQuery } from 'react-query'

import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { readProvider } from 'lib/services/readProvider'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useEnvChainIds } from 'lib/hooks/chainId/useEnvChainIds'
import { useMemo } from 'react'

/**
 *
 * @param {*} chainId a chainId to get a provider for
 * @returns Providers for the provided chain id
 */
export const useReadProvider = (chainId) =>
  useQuery([QUERY_KEYS.readProvider, chainId], () => readProvider(chainId))
