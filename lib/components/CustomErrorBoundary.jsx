import React, { useContext } from 'react'
import Cookies from 'js-cookie'
import * as Sentry from '@sentry/react'

import {
  SELECTED_WALLET_COOKIE_KEY
} from 'lib/constants'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { ErrorPage } from 'lib/components/ErrorPage'

export function CustomErrorBoundary(props) {
  const { children } = props
  const { onboardWallet } = useContext(WalletContext)

  let walletName = onboardWallet?.name

  if (!walletName) {
    walletName = Cookies.get(SELECTED_WALLET_COOKIE_KEY)
  }

  return <>
    <Sentry.ErrorBoundary
      beforeCapture={(scope) => {
        scope.setTag('web3', walletName)

        scope.setContext('wallet', {
          name: walletName
        })
      }}
      fallback={({ error, componentStack, resetError }) => (
        <ErrorPage />
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  </>
}