import { useQuery } from 'react-query'

import {
  UNISWAP_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getUniswapData } from 'lib/utils/getUniswapData'

export function useUniswapTokensQuery(chainId, externalAwardsData) {
  // TODO: another place we need to be able to support multiple pools:
  const addresses = externalAwardsData?.daiPool?.externalErc20Awards?.map(award => award.address)

  return useQuery(
    [QUERY_KEYS.uniswapTokensQuery],
    async () => { return getUniswapData(chainId, addresses) },
    { 
      enabled: addresses,
      refetchInterval: UNISWAP_POLLING_INTERVAL
    }
  )
}
