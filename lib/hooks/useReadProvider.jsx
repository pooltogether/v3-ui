import { useQuery } from 'react-query'

import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { readProvider } from 'lib/services/readProvider'
import { useNetwork } from 'lib/hooks/useNetwork'

export const useReadProvider = () => {
  const { chainId } = useNetwork()
  // console.log(chainId)

  const { data: _readProvider, isFetched } = useQuery([QUERY_KEYS.readProvider, chainId], () =>
    readProvider(chainId)
  )
  // console.log({ _readProvider })

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

// import { useContext, useEffect, useState } from 'react'

// import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
// import { readProvider } from 'lib/services/readProvider'

// export function useReadProvider() {
//   const { networkName } = useContext(AuthControllerContext)

//   const [defaultReadProvider, setDefaultReadProvider] = useState({})

//   useEffect(() => {
//     const getReadProvider = async () => {
//       if (networkName !== 'unknown network') {
//         const defaultReadProvider = await readProvider(networkName)
//         setDefaultReadProvider(defaultReadProvider)
//       }
//     }
//     getReadProvider()
//   }, [networkName])

//   return {
//     readProvider: defaultReadProvider,
//     isLoaded: defaultReadProvider && Object.keys(defaultReadProvider).length > 0
//   }
// }
