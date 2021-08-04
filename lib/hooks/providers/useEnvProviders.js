import { useReadProviders } from '@pooltogether/hooks'

import { useEnvChainIds } from 'lib/hooks/chainId/useEnvChainIds'

/**
 *
 * @returns Providers for all environment chain ids
 */
export const useEnvReadProviders = () => {
  const chainIds = useEnvChainIds()
  return useReadProviders(chainIds)
}
