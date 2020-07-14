import React, { useEffect, useState, useContext } from 'react'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import {
  SELECTED_WALLET_COOKIE_KEY,
  MAGIC_EMAIL,
} from 'lib/constants'
import { MagicContext } from 'lib/components/contextProviders/MagicContextProvider'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { getChainId } from 'lib/utils/getChainId'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const AuthControllerContext = React.createContext()

// This AuthController allows us to have one place to interface with both the Magic context and
// the Onboardjs/Wallet context - this provides us with more control of what happens to
// both when one is signed in / signed out of and avoids circular dependencies
//
// This also provides a unified authentication pattern to get the usersAddress
// and ethers provider for transactions
export const AuthControllerContextProvider = (props) => {
  const { children } = props

  const router = useRouter()

  const walletContext = useContext(WalletContext)
  const { _onboard, doConnectWallet, handleShowOnboard, onboardState } = walletContext

  const magicContext = useContext(MagicContext)
  const { magic } = magicContext
  
  const currentState = _onboard && _onboard.getState()
  // TODO: extend this to also pull the eth balance from the magic session
  // may need state / ethereum event listener
  const ethBalance = currentState && currentState.balance ?
    currentState.balance :
    ethers.utils.bigNumberify(0)
  // const [ethBalance, setEthBalance] = useState(ethers.utils.bigNumberify(0))
  // useEffect(() => {
  //   if (ethBalance) {
  //     setEthBalance(ethers.utils.bigNumberify(ethBalance))
  //   }
  // }, [authControllerContext])

  let walletName = 'Unknown'
  if (magic && magicContext.signedIn) {
    walletName = 'Magic'
  } else if (currentState && currentState.wallet) {
    walletName = currentState.wallet.name
  }

  const [chainId, setChainId] = useState(getChainId(currentState))
  const [provider, setProvider] = useState()
  const [usersAddress, setUsersAddress] = useState()
  const [magicAutoSignInAlreadyExecuted, setMagicAutoSignInAlreadyExecuted] = useState(false)
  const [walletAutoSignInAlreadyExecuted, setWalletAutoSignInAlreadyExecuted] = useState(false)

  useEffect(() => {
    let provider = onboardState && onboardState.provider
    if (!provider && magicContext.signedIn) {
      provider = magicContext.provider
    }
    setProvider(provider)
  }, [currentState, magicContext.signedIn])

  useEffect(() => {
    const cID = getChainId(currentState)
    if (cID) {
      // console.log('updating chainId: ', cID)
      setChainId(cID)
    }
  }, [currentState])

  useEffect(() => {
    let usersAddress

    if (currentState && currentState.address) {
      usersAddress = currentState.address
      // console.log('wallet usersAddress', usersAddress)
    }

    if (!usersAddress && magicContext.address) {
      usersAddress = magicContext.address
      // console.log('magicContext.address', magicContext.address)
    }

    // console.log('setting usersAddress: ', usersAddress)
    setUsersAddress(usersAddress)
  }, [magicContext.address, currentState])

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
    // console.log('postDisconnectRedirect')
    // console.log('adding signIn 1')
    queryParamUpdater.add(router, { signIn: '1' })
    // console.log(router.query)
  }

  const signOut = async (e) => {
    if (e) {
      e.preventDefault()
    }

    magicContext.signOut()
    walletContext.disconnectWallet()
    postDisconnectRedirect()
  }

  const signInMagic = async (formEmail, postSignInCallback) => {
    magicContext.signIn(formEmail, postSignInCallback)
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
      ethBalance,
      chainId,
      provider,
      usersAddress,
      walletName,
      signOut,
      signInMagic,
      handleShowOnboard,
    }}
  >
    {children}
  </AuthControllerContext.Provider>
}
