import React, { useContext } from 'react'
import useWindowFocus from 'use-window-focus'
import { useOnlineState } from 'beautiful-react-hooks'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Modal } from 'lib/components/Modal'

export const GeneralContext = React.createContext()

export const GeneralContextProvider = (props) => {
  if (!window) {
    return null
  }
  
  const { t } = useTranslation()

  const authControllerContext = useContext(AuthControllerContext)
  const { changingNetwork, supportedNetwork } = authControllerContext

  const windowFocused = true || useWindowFocus()
  // const isOnline = useOnlineState()
  const paused = !windowFocused || !supportedNetwork || changingNetwork
  // const paused = !windowFocused || !isOnline || !supportedNetwork || changingNetwork

  return <GeneralContext.Provider
    value={{
      // isOnline,
      paused,
      windowFocused,
    }}
  >
    {/* <Modal
      zIndex={2000000}
      visible={!isOnline}
      header={t('noInternetConnection')}
    >
      <p>
        {t('weDetectedThatYouAreOffline')}
      </p>
      <p>
        {t('pleaseReconnectToInternet')}
      </p>
    </Modal> */}

    {props.children}
  </GeneralContext.Provider>
}
