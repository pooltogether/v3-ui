import React, { useContext } from 'react'
import { useOnlineState } from 'beautiful-react-hooks'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Modal } from 'lib/components/Modal'

export const GeneralContext = React.createContext()

export const GeneralContextProvider = (props) => {
  if (!window) {
    return null
  }

  const authControllerContext = useContext(AuthControllerContext)
  const { supportedNetwork } = authControllerContext

  const isOnline = useOnlineState()
  const paused = !isOnline || !supportedNetwork

  return <GeneralContext.Provider
    value={{
      isOnline,
      paused
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
