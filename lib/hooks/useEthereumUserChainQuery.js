import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS,
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { fetchUsersChainData } from 'lib/utils/fetchUsersChainData'

const getEthereumUserChainData = async (params) => {
  return await fetchUsersChainData(params)
}

export function useEthereumUserChainQuery(params) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)
  
  const {
    provider,
    pool,
    usersAddress,
    contractAddresses
  } = params

  const poolIsReady = Boolean(pool?.underlyingCollateralDecimals)

  const enabled = !Boolean(pauseQueries) &&
    Boolean(chainId) &&
    !isEmpty(provider) &&
    poolIsReady &&
    Boolean(usersAddress) &&
    !isEmpty(contractAddresses)

  const refetchInterval = MAINNET_POLLING_INTERVAL

  return useQuery(
    [QUERY_KEYS.ethereumUserChainQuery, chainId, usersAddress, -1],
    async () => await getEthereumUserChainData(params),
    { 
      enabled,
      refetchInterval
    }
  )
}
