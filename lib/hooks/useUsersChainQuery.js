import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { MAINNET_POLLING_INTERVAL, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { fetchUsersChainData } from 'lib/utils/fetchUsersChainData'

const getUsersChainData = async (params) => {
  return await fetchUsersChainData(params)
}

export function useUsersChainQuery(params) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { provider, pool, usersAddress } = params

  const poolIsReady = Boolean(pool?.underlyingCollateralDecimals)

  const enabled =
    !Boolean(pauseQueries) &&
    Boolean(chainId) &&
    !isEmpty(provider) &&
    poolIsReady &&
    Boolean(usersAddress)

  const refetchInterval = MAINNET_POLLING_INTERVAL

  return useQuery(
    [QUERY_KEYS.ethereumUsersChainQuery, chainId, usersAddress, -1],
    async () => await getUsersChainData(params),
    {
      enabled,
      refetchInterval
    }
  )
}
