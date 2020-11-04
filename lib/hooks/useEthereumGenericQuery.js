import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS,
} from 'lib/constants'
import { fetchGenericChainData } from 'lib/utils/fetchGenericChainData'

const getEthereumErc20Data = async (params) => {
  return await fetchGenericChainData(params)
}

export function useEthereumGenericQuery(params) {
  const { 
    provider,
    poolData
  } = params

  const enabled = !isEmpty(provider) &&
    !isEmpty(poolData)

  const poolAddress = poolData.poolAddress

  return useQuery(
    [QUERY_KEYS.ethereumGenericQuery, poolAddress],
    async () => await getEthereumErc20Data(params),
    { 
      enabled,
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}
