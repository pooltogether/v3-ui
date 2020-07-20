import React, { useContext } from 'react'

import {
  SUPPORTED_CHAIN_IDS
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContextProvider } from 'lib/components/contextProviders/PoolDataContextProvider'

export const DataContextProviders = (props) => {
  const { children } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { chainId, usersAddress } = authControllerContext

  let dataOrUnsupportedNetworkJsx = null
  if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
    dataOrUnsupportedNetworkJsx = children
  } else {
    dataOrUnsupportedNetworkJsx = <PoolDataContextProvider>
      {children}
    </PoolDataContextProvider>
  }
  
  return dataOrUnsupportedNetworkJsx
}
