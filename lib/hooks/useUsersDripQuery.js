import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { fetchUsersDripData } from 'lib/utils/fetchUsersDripData'

const getUsersChainData = async (params) => {
  return await fetchUsersDripData(params)
}

export function useUsersDripQuery(params) {
  const { network: chainId } = useOnboard()

  const { provider, pool, usersAddress, comptrollerAddress, pairs, dripTokens } = params

  const enabled =
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
      refetchInterval
    }
  )
}
