import React, { useEffect, useState, useContext } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useApolloClient } from '@apollo/client'

import {
  COOKIE_OPTIONS,
  STORED_CHAIN_ID_KEY,
  SUPPORTED_CHAIN_IDS,
  SELECTED_WALLET_COOKIE_KEY,
  MAGIC_EMAIL,
} from 'lib/constants'
import { MagicContext } from 'lib/components/contextProviders/MagicContextProvider'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { getChainId } from 'lib/utils/getChainId'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

const debug = require('debug')('AuthControllerContextProvider')

export const AuthControllerContext = React.createContext()

// This AuthController allows us to have one place to interface with both the Magic context and
// the Onboardjs/Wallet context - this provides us with more control of what happens to
// both when one is signed in / signed out of and avoids circular dependencies
//
// This also provides a unified authentication pattern to get the usersAddress
// and ethers provider for transactions
export const AuthControllerContextProvider = (props) => {
  const client = useApolloClient();

  const { children } = props

  const router = useRouter()

  const walletContext = useContext(WalletContext)
  const {
    onboard,
    onboardAddress,
    onboardBalance,
    onboardNetwork,
    onboardProvider,
    onboardWallet,
    reconnectWallet,
    connectWallet,
  } = walletContext

  const magicContext = useContext(MagicContext)
  const { magic } = magicContext
 
  // TODO: extend this to also pull the eth balance from the magic session
  // may need state / ethereum event listener
  const ethBalance = onboardBalance || null
  // const [ethBalance, setEthBalance] = useState(ethers.utils.bigNumberify(0))
  // useEffect(() => {
  //   if (ethBalance) {
  //     setEthBalance(ethers.utils.bigNumberify(ethBalance))
  //   }
  // }, [])

  let walletName = 'Unknown'
  if (magic && magicContext.signedIn) {
    walletName = 'Magic'
  } else if (onboardWallet) {
    walletName = onboardWallet.name
  }

  const defaultChainId = getChainId(process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME)
  const [chainId, setChainId] = useState(defaultChainId)
  const [provider, setProvider] = useState()
  const [usersAddress, setUsersAddress] = useState()
  const [magicAutoSignInAlreadyExecuted, setMagicAutoSignInAlreadyExecuted] = useState(false)

  useEffect(() => {
    let provider = onboardProvider
    if (!provider && magicContext.signedIn) {
      provider = magicContext.provider
    }
    setProvider(provider)
  }, [onboardProvider, magicContext.signedIn])

  useEffect(() => {
    if (onboardNetwork) {
      setChainId(onboardNetwork)

      client.resetStore()
    }
  }, [onboardNetwork])

  useEffect(() => {
    let usersAddress

    if (onboardAddress) {
      usersAddress = onboardAddress
    }

    if (!usersAddress && magicContext.address) {
      usersAddress = magicContext.address
    }

    setUsersAddress(usersAddress)
  }, [magicContext.address, onboardAddress])

  const postDisconnectRedirect = () => {
    queryParamUpdater.add(router, { signIn: '1' })
  }

  const signOut = async (e) => {
    if (e) {
      e.preventDefault()
    }

    // magicContext.signOut()
    walletContext.disconnectWallet()

    postDisconnectRedirect()
  }

  const signInMagic = async (formEmail, postSignInCallback) => {
    magicContext.signIn(formEmail, postSignInCallback)
    walletContext.disconnectWallet()
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
      debug('inside onboard UseEffect if!')
      const autoSignInWallet = async () => {
        const previouslySelectedWallet = Cookies.get(SELECTED_WALLET_COOKIE_KEY)

        if (previouslySelectedWallet !== undefined) {
          debug('running autosign in!')
          reconnectWallet(previouslySelectedWallet)
        }
      }

      autoSignInWallet()
    }
  }, [onboard])

  const networkName = chainIdToNetworkName(chainId)
  const supportedNetwork = SUPPORTED_CHAIN_IDS.includes(chainId)

  Cookies.set(
    STORED_CHAIN_ID_KEY,
    chainId,
    COOKIE_OPTIONS
  )
  // console.log('setting ', chainId)

  return <AuthControllerContext.Provider
    value={{
      ethBalance,
      chainId,
      provider,
      usersAddress,
      walletName,
      signOut,
      signInMagic,
      connectWallet,
      networkName,
      supportedNetwork,
    }}
  >
    {children}
  </AuthControllerContext.Provider>
}
