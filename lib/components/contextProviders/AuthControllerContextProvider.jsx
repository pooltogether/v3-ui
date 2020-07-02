import React, { useEffect, useState, useContext } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import {
  COOKIE_OPTIONS,
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
  const { onboard, doConnectWallet, handleShowOnboard } = walletContext
  
  const magicContext = useContext(MagicContext)
  const { magic } = magicContext


  const postConnectRedirect = () => {
    console.log('in postCOnnectRedirect')
    
    router.push(
      `${router.pathname}`,
      `${router.asPath}`,
      {
        shallow: true
      }
    )
  }


  const signInMagic = async (formEmail) => {
    magicContext.signIn(formEmail)
    walletContext.disconnectWallet()
    postConnectRedirect()
  }

  const signInWallet = async () => {
    console.log('in signInWallet')
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
    if (onboard) {
      const autoSignInWallet = async () => {
        const previouslySelectedWallet = Cookies.get(SELECTED_WALLET_COOKIE_KEY)

        if (previouslySelectedWallet !== undefined) {
          console.log('auto signin, using onboard wallet cookie')
          signInWallet(previouslySelectedWallet)
        }
      }

      if (!walletAutoSignInAlreadyExecuted) {
        autoSignInWallet()
      }

      setWalletAutoSignInAlreadyExecuted(true)
    }
  }, [onboard])

  return <AuthControllerContext.Provider
    value={{
      signInWallet,
      signInMagic,
      handleShowOnboard,
    }}
  >
    {children}
  </AuthControllerContext.Provider>
}
