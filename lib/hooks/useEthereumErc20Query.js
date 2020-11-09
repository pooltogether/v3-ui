import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS,
} from 'lib/constants'
import { fetchExternalErc20Awards } from 'lib/utils/fetchExternalErc20Awards'

const getEthereumErc20Data = async (params) => {
  return await fetchExternalErc20Awards(params)
}

export function useEthereumErc20Query(params) {
  let { blockNumber } = params
  const {
    provider,
    graphErc20Awards,
    coingeckoData,
    poolAddress,
  } = params

  if (!blockNumber) {
    blockNumber = -1
  }

  // probably temporary til we use Uniswap Graph data over Coingecko, but basically
  // we want more than just the price of ETH before we run this query
  const allPriceDataAvailable = coingeckoData && Object.keys(coingeckoData).length > 1

  const enabled = !isEmpty(provider) &&
    !isEmpty(graphErc20Awards) &&
    allPriceDataAvailable &&
    // !isEmpty(coingeckoData) &&
    !!poolAddress

  return useQuery(
    [QUERY_KEYS.ethereumErc20sQuery, poolAddress, blockNumber],
    async () => await getEthereumErc20Data(params),
    { 
      enabled,
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}
