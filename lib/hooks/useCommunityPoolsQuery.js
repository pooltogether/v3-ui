import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { MAINNET_POLLING_INTERVAL, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPoolsData } from 'lib/fetchers/getPoolsData'

export function useCommunityPoolsQuery(poolAddresses) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const refetchInterval = MAINNET_POLLING_INTERVAL

  // enforce The Graph protocol's lowercase needs
  poolAddresses = poolAddresses?.map((address) => address.toLowerCase())

  return useQuery(
    [QUERY_KEYS.communityPoolsQuery, chainId],
    async () => {
      return getPoolsData(chainId, poolAddresses)
    },
    {
      enabled: !pauseQueries && chainId && !isEmpty(poolAddresses),
      refetchInterval,
    }
  )
}
