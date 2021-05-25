import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { fetchExternalErc1155Awards } from 'lib/utils/fetchExternalErc1155Awards'

export function useEthereumErc1155Query(params) {
  const { balanceOfAddress, provider, chainId } = params

  const addresses = params.erc1155Awards?.map((award) => award.address).join(',')

  const enabled = chainId && !isEmpty(provider) && !isEmpty(addresses) && !!balanceOfAddress

  const refetchInterval = MAINNET_POLLING_INTERVAL

  return useQuery(
    [QUERY_KEYS.ethereumErc1155sQuery, chainId, balanceOfAddress, addresses, -1],
    async () => await fetchExternalErc1155Awards(params),
    {
      enabled,
      refetchInterval
    }
  )
}
