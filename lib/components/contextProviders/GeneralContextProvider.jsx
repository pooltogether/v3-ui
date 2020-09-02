import React, { useContext } from 'react'
import useWindowFocus from 'use-window-focus'
import { useOnlineState } from 'beautiful-react-hooks'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Modal } from 'lib/components/Modal'

export const GeneralContext = React.createContext()

export const GeneralContextProvider = (props) => {
  if (!window) {
    return null
  }
  
  const authControllerContext = useContext(AuthControllerContext)
  const { changingNetwork, supportedNetwork } = authControllerContext

  const windowFocused = true || useWindowFocus()
  const isOnline = useOnlineState()
  const paused = !windowFocused || !isOnline || !supportedNetwork || changingNetwork

  return <GeneralContext.Provider
    value={{
      isOnline,
      paused,
      windowFocused,
    }}
  >
    <Modal
      zIndex={2000000}
      visible={!isOnline}
      header={<>
        No Internet connection
      </>}
    >
      <p>
        We detected that you are offline.
      </p>
      <p>
        Please reconnect to the Internet and try again.
      </p>
    </Modal>

    {props.children}
  </GeneralContext.Provider>
}
