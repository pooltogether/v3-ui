import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { fetchUsersChainData } from 'lib/utils/fetchUsersChainData'

const getUsersChainData = async (params) => {
  return await fetchUsersChainData(params)
}

export function useUsersChainQuery(params) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { provider, usersAddress, prizePoolAddress, tokenAddress } = params

  const enabled =
    !Boolean(pauseQueries) &&
    Boolean(chainId) &&
    !isEmpty(provider) &&
    Boolean(usersAddress) &&
    Boolean(tokenAddress) &&
    Boolean(prizePoolAddress)

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
