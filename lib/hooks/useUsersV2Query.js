import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { MAINNET_POLLING_INTERVAL, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { fetchUsersV2Data } from 'lib/utils/fetchUsersV2Data'

export function useUsersV2Query(params) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { provider, usersAddress, contractAddresses } = params

  const enabled =
    !Boolean(pauseQueries) &&
    Boolean(chainId) &&
    !isEmpty(provider) &&
    Boolean(usersAddress) &&
    !isEmpty(contractAddresses)

  const refetchInterval = MAINNET_POLLING_INTERVAL

  return useQuery(
    [QUERY_KEYS.ethereumUsersV2Query, chainId, usersAddress, -1],
    async () => await fetchUsersV2Data(chainId, provider, usersAddress, contractAddresses),
    {
      enabled,
      refetchInterval,
    }
  )
}
