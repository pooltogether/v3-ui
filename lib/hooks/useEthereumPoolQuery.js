import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { fetchPoolChainData } from 'lib/utils/fetchPoolChainData'

export function useEthereumPoolQuery(params) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { poolGraphData, provider } = params

  let blockNumber = params.blockNumber

  if (!blockNumber) {
    blockNumber = -1
  }

  const prizeStrategyAddress = poolGraphData?.prizeStrategy?.id
  const poolAddress = poolGraphData?.poolAddress

  const enabled =
    !pauseQueries &&
    chainId &&
    !isEmpty(provider) &&
    !isEmpty(poolGraphData) &&
    Boolean(prizeStrategyAddress) &&
    Boolean(poolAddress)

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.ethereumPoolQuery, chainId, poolAddress, blockNumber],
    async () => await fetchPoolChainData(params),
    {
      enabled,
      refetchInterval
    }
  )
}
