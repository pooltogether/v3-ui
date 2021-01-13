import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import {
  ERC_721_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { fetchExternalErc721Awards } from 'lib/utils/fetchExternalErc721Awards'

export function useEthereumErc721Query(params) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { balanceOfAddress, provider } = params

  const enabled = !pauseQueries &&
    chainId &&
    !isEmpty(provider) &&
    Boolean(balanceOfAddress)

  return useQuery(
    [QUERY_KEYS.ethereumErc721sQuery, chainId, balanceOfAddress/*, blockNumber*/],
    async () => await fetchExternalErc721Awards(params),
    { 
      enabled,
    }
  )
}
