import React, { useEffect, useState, useContext } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import {
  SELECTED_WALLET_COOKIE_KEY,
  MAGIC_EMAIL,
} from 'lib/constants'
import { MagicContext } from 'lib/components/contextProviders/MagicContextProvider'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'

export const AuthControllerContext = React.createContext()

// This AuthController allows us to have one place to interface with both the Magic context and
// the Onboardjs/Wallet context - this provides us with more control of what happens to
// both when one is signed in / signed out of and avoids circular dependencies
export const AuthControllerContextProvider = (props) => {
  const { children } = props

  const router = useRouter()

  const [magicAutoSignInAlreadyExecuted, setMagicAutoSignInAlreadyExecuted] = useState(false)
  const [walletAutoSignInAlreadyExecuted, setWalletAutoSignInAlreadyExecuted] = useState(false)

  const walletContext = useContext(WalletContext)
  const { _onboard, doConnectWallet, handleShowOnboard } = walletContext
  
  const magicContext = useContext(MagicContext)
  const { magic } = magicContext


  const postConnectRedirect = () => {
    router.push(
      `${router.pathname}`,
      `${router.asPath}`,
      {
        shallow: true
      }
    )
  }
  

  const postDisconnectRedirect = () => {
    router.push(
      `${router.pathname}?signIn=1`,
      `${router.asPath}?signIn=1`,
      {
        shallow: true
      }
    )
  }

  const signOut = async (e) => {
    if (e) {
      e.preventDefault()
    }

    magicContext.signOut()
    walletContext.disconnectWallet()
    postDisconnectRedirect()
  }

  const signInMagic = async (formEmail) => {
    magicContext.signIn(formEmail)
    walletContext.disconnectWallet()
  }

  const signInWallet = async (previouslySelectedWallet) => {
    doConnectWallet(previouslySelectedWallet)
    postConnectRedirect()
  }

  useEffect(() => {
    if (magic) {
      const emailFromCookies = Cookies.get(MAGIC_EMAIL)

      const autoSignInMagic = async () => {
        if (await magic.user.isLoggedIn()) {
          signInMagic(emailFromCookies)
        }
      }

      if (emailFromCookies && !magicAutoSignInAlreadyExecuted) {
        autoSignInMagic()
      }

      setMagicAutoSignInAlreadyExecuted(true)
    }

  }, [magic])

  useEffect(() => {
    if (_onboard) {
      const autoSignInWallet = async () => {
        const previouslySelectedWallet = Cookies.get(SELECTED_WALLET_COOKIE_KEY)

        if (previouslySelectedWallet !== undefined) {
          signInWallet(previouslySelectedWallet)
        }
      }

      if (!walletAutoSignInAlreadyExecuted) {
        autoSignInWallet()
      }

      setWalletAutoSignInAlreadyExecuted(true)
    }
  }, [_onboard])

  return <AuthControllerContext.Provider
    value={{
      // signInWallet,
      signOut,
      signInMagic,
      handleShowOnboard,
    }}
  >
    {children}
  </AuthControllerContext.Provider>
}
