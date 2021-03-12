import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { fetchExternalErc721Awards } from 'lib/utils/fetchExternalErc721Awards'

export function useEthereumErc721Query(params) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { balanceOfAddress, provider } = params

  const addresses = params.graphErc721Awards?.map((award) => award.address).join(',')

  const enabled =
    !pauseQueries &&
    chainId &&
    !isEmpty(provider) &&
    !isEmpty(addresses) &&
    Boolean(balanceOfAddress)

  const refetchInterval = MAINNET_POLLING_INTERVAL

  return useQuery(
    [QUERY_KEYS.ethereumErc721sQuery, chainId, balanceOfAddress, addresses, -1],
    async () => await fetchExternalErc721Awards(params),
    {
      enabled,
      refetchInterval
    }
  )
}
