import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { UNISWAP_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getTokenPriceData } from 'lib/fetchers/getTokenPriceData'
import { useUniswapSubgraphClient } from 'lib/hooks/subgraphClients/useUniswapSubgraphClient'

export function useUniswapTokensQuery(addresses, blockNumber = -1) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = useUniswapSubgraphClient()

  addresses = addresses?.map((address) => address.toLowerCase())

  const cacheKey = [
    QUERY_KEYS.uniswapTokensQuery,
    chainId,
    !isEmpty(addresses) ? addresses.join('-') : '',
    blockNumber
  ]

  const mainnet = chainId === 1

  const refetchInterval = blockNumber === -1 ? UNISWAP_POLLING_INTERVAL : false

  return useQuery(
    cacheKey,
    async () => {
      return getTokenPriceData(chainId, addresses, blockNumber)
    },
    {
      enabled: Boolean(!pauseQueries && mainnet && !isEmpty(addresses)),
      refetchInterval
    }
  )
}
