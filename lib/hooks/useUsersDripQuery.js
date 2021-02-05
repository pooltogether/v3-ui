import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { MAINNET_POLLING_INTERVAL, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { fetchUsersDripData } from 'lib/utils/fetchUsersDripData'

const getUsersChainData = async (params) => {
  return await fetchUsersDripData(params)
}

export function useUsersDripQuery(params) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { provider, pool, usersAddress, comptrollerAddress, pairs, dripTokens } = params

  const enabled =
    !Boolean(pauseQueries) &&
    Boolean(chainId) &&
    !isEmpty(provider) &&
    Boolean(usersAddress) &&
    Boolean(comptrollerAddress) &&
    Boolean(pairs) &&
    Boolean(dripTokens)

  const refetchInterval = MAINNET_POLLING_INTERVAL

  return useQuery(
    [QUERY_KEYS.ethereumUserChainQuery, chainId, usersAddress, -1],
    async () => await getUsersChainData(params),
    {
      enabled,
      refetchInterval,
    }
  )
}
