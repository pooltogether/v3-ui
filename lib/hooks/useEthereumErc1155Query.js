import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS,
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { fetchExternalErc1155Awards } from 'lib/utils/fetchExternalErc1155Awards'

export function useEthereumErc1155Query(params) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)
  
  const { balanceOfAddress, provider } = params

  let blockNumber = params.blockNumber

  if (!blockNumber) {
    blockNumber = -1
  }

  const enabled = !pauseQueries &&
    chainId &&
    !isEmpty(provider) &&
    !!balanceOfAddress

  const refetchInterval = (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  const addresses = params.graphErc1155Awards
    ?.map(award => award.address)
    .join(',')

  return useQuery(
    [QUERY_KEYS.ethereumErc1155sQuery, chainId, balanceOfAddress, addresses, -1],
    async () => await fetchExternalErc1155Awards(params),
    { 
      enabled,
      refetchInterval
    }
  )
}
