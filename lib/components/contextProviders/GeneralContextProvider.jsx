import React, { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'

export const GeneralContext = React.createContext()

export function GeneralContextProvider(props) {
  if (!window) {
    return null
  }
  
  const { changingNetwork, supportedNetwork } = useContext(AuthControllerContext)

  const paused = !supportedNetwork || changingNetwork

  return <GeneralContext.Provider
    value={{
      paused,
    }}
  >
    {props.children}
  </GeneralContext.Provider>
}
