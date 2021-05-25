import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { fetchExternalErc20Awards } from 'lib/utils/fetchExternalErc20Awards'

export function useEthereumErc20Query(params) {
  const { balanceOfAddress, provider, chainId } = params

  const addresses = params.graphErc20Awards?.map((award) => award.address).join(',')

  const enabled = chainId && !isEmpty(provider) && !isEmpty(addresses) && !!balanceOfAddress

  const refetchInterval = MAINNET_POLLING_INTERVAL

  return useQuery(
    [QUERY_KEYS.ethereumErc20sQuery, chainId, balanceOfAddress, addresses, -1],
    async () => await fetchExternalErc20Awards(params),
    {
      enabled,
      refetchInterval
    }
  )
}
