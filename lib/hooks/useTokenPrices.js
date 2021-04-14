import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { getTokenPrices } from 'lib/fetchers/getTokenPriceData'
import { useChainId } from 'lib/hooks/useChainId'
import { useQuery, useQueryClient } from 'react-query'

/**
 * Returns lists of token prices by the block numbers
 * @param {object} addresses arrays of addresses keyed by a block number
 * @returns
 */
export const useTokenPrices = (addresses) => {
  const chainId = useChainId()
  const queryClient = useQueryClient()

  const flatAddresses = addresses ? Object.values(addresses).flat() : []
  const blockNumbers = addresses ? Object.keys(addresses) : []

  const enabled = Boolean(addresses && flatAddresses?.length > 0)

  return useQuery(
    [QUERY_KEYS.tokenPrices, chainId, flatAddresses, blockNumbers],
    async () => await getTokenPrices(chainId, addresses),
    {
      enabled,
      onSuccess: (data) => populateCaches(chainId, queryClient, data, addresses)
    }
  )
}

/**
 * Prepopulate the cache for individual queries
 * Used when navigating from prize table -> prize page
 * @param {*} chainId
 * @param {*} queryClient
 * @param {*} data
 * @param {*} addresses
 */
const populateCaches = (chainId, queryClient, data, addresses) => {
  const blockNumbers = Object.keys(addresses)
  blockNumbers.forEach((blockNumber) => {
    const tokenAddresses = addresses[blockNumber]
    queryClient.setQueryData(
      [[QUERY_KEYS.tokenPrices, chainId, tokenAddresses, [blockNumber]]],
      [data[blockNumber]]
    )
  })
}
