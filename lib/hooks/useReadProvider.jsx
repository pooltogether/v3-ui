import { useQuery } from 'react-query'

import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { readProvider } from 'lib/services/readProvider'
import { useNetwork } from 'lib/hooks/useNetwork'

export const useReadProvider = () => {
  const { chainId } = useNetwork()

  const { data: _readProvider, isFetched } = useQuery([QUERY_KEYS.readProvider, chainId], () =>
    readProvider(chainId)
  )

  const isLoaded =
    _readProvider &&
    chainId &&
    isFetched &&
    Object.keys(_readProvider).length > 0 &&
    _readProvider?.network?.chainId === chainId

  return {
    readProvider: _readProvider,
    isLoaded
  }
}
