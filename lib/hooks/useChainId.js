import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useContext } from 'react'

export const useChainId = () => useContext(AuthControllerContext).chainId
