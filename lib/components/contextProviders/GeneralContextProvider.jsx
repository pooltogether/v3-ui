import React, { useContext } from 'react'
import useWindowFocus from 'use-window-focus'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'

export const GeneralContext = React.createContext()

export function GeneralContextProvider(props) {
  if (!window) {
    return null
  }
  
  const authControllerContext = useContext(AuthControllerContext)
  const { changingNetwork, supportedNetwork } = authControllerContext

  const windowFocused = true || useWindowFocus()
  const paused = !windowFocused || !supportedNetwork || changingNetwork

  return <GeneralContext.Provider
    value={{
      paused,
      windowFocused,
    }}
  >
    {props.children}
  </GeneralContext.Provider>
}
