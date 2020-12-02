import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS,
} from 'lib/constants'
import { fetchGenericChainData } from 'lib/utils/fetchGenericChainData'

const getEthereumErc20Data = async (params) => {
  const data = await fetchGenericChainData(params)
  
  return {
    dai: data
  }
}

export function useEthereumGenericQuery(params) {
  const {
    chainId,
    pauseQueries,
    provider,
    poolData
  } = params

  let blockNumber = params.blockNumber

  if (!blockNumber) {
    blockNumber = -1
  }

  const prizeStrategyAddress = poolData?.prizeStrategy?.id
  const cTokenAddress = poolData?.compoundPrizePool?.cToken
  const poolAddress = poolData?.poolAddress

  const enabled = !pauseQueries &&
    chainId &&
    !isEmpty(provider) &&
    !isEmpty(poolData) && 
    Boolean(prizeStrategyAddress) &&
    Boolean(cTokenAddress) &&
    Boolean(poolAddress)

  const refetchInterval = !pauseQueries && (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  return useQuery(
    [QUERY_KEYS.ethereumGenericQuery, chainId, poolAddress, blockNumber],
    async () => await getEthereumErc20Data(params),
    { 
      enabled,
      refetchInterval
    }
  )
}
