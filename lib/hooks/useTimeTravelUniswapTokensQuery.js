import { useQuery } from 'react-query'

import {
  UNISWAP_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { getUniswapData } from 'lib/utils/getUniswapData'

export function useTimeTravelUniswapTokensQuery(externalAwardsData, blockNumber) {
  // TODO: another place we need to be able to support multiple pools:
  const addresses = externalAwardsData?.daiPool?.externalErc20Awards?.map(award => award.address)
  console.log(addresses)

  return useQuery(
    [QUERY_KEYS.uniswapTokensQuery, blockNumber],
    async () => { return getUniswapData(addresses, blockNumber) },
    { 
      enabled: addresses && blockNumber,
      refetchInterval: UNISWAP_POLLING_INTERVAL
    }
  )
}
