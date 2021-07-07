import { useQuery } from 'react-query'

import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { readProvider } from 'lib/services/readProvider'

/**
 *
 * @param {*} chainId a chainId to get a provider for
 * @returns Providers for the provided chain id
 */
export const useReadProvider = (chainId) =>
  useQuery([QUERY_KEYS.readProvider, chainId], () => readProvider(chainId))

/**
 *
 * @param {*} chainIds an array of chainIds to get providers for
 * @returns Providers for all chain ids
 */
export const useReadProviders = (chainIds) => {
  return useQuery([QUERY_KEYS.readProviders, chainIds], () => collectReadProviders(chainIds), {
    enabled: chainIds?.length > 0
  })
}

const collectReadProviders = async (chainIds) => {
  let readProviders = {}

  await chainIds.forEach(async (chainId) => {
    const provider = await readProvider(chainId)
    readProviders[chainId] = provider
  })

  console.log(chainIds)

  return readProviders
}
