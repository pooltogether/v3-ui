import React, { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'

import { MagicContext } from 'lib/components/contextProviders/MagicContextProvider'

import { initOnboard } from 'lib/services/initOnboard'

import {
  COOKIE_OPTIONS,
  SELECTED_WALLET_COOKIE_KEY
} from 'lib/constants'

const debug = require('debug')('WalletContextProvider')

let provider

export const WalletContext = React.createContext()

export const WalletContextProvider = (props) => {
  const {
    children,
    postConnectCallback,
  } = props

  const [address, setAddress] = useState(null)
  const [network, setNetwork] = useState(null)
  const [balance, setBalance] = useState(null)
  const [wallet, setWallet] = useState({})
  
  const [onboard, setOnboard] = useState(null)

  const magicContext = useContext(MagicContext)
  const { magic } = magicContext

  const disconnectWallet = () => {
    onboard.walletReset()

    Cookies.remove(
      SELECTED_WALLET_COOKIE_KEY,
      COOKIE_OPTIONS
    )
  }

  const getOnboard = () => {
    return initOnboard({
      address: setAddress,
      network: setNetwork,
      //     network: async (n) => {
      //       await onboard.config({ networkId: n })
      //       setNetwork(n)
      //     },
      balance: setBalance,
      wallet: wallet => {
        if (wallet.provider) {
          if (magic) {
            magicContext.signOut()
          }

          setWallet(wallet)

          Cookies.set(
            SELECTED_WALLET_COOKIE_KEY,
            wallet.name,
            COOKIE_OPTIONS
          )

          provider = new ethers.providers.Web3Provider(wallet.provider)

          // postConnectCallback()
        } else {
          provider = null
          setWallet({})
          Cookies.remove(
            SELECTED_WALLET_COOKIE_KEY,
            COOKIE_OPTIONS
          )
        }
      }
    })
  }

  useEffect(() => {
    setOnboard(getOnboard())
  }, [])
    
  const connectWallet = async (
    postSignInCallback
  ) => {
    await onboard.walletSelect()

    if (onboard.getState().wallet.type) {
      await onboard.walletCheck()
      debug({ currentState: onboard.getState() })

      if (postSignInCallback) {
        postSignInCallback()
      }
    }
  }
  
  const reconnectWallet = (previouslySelectedWallet) => {
    onboard.walletReset()

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet)
    }
  }

  return <WalletContext.Provider
    value={{
      onboard,
      onboardAddress: address,
      onboardBalance: balance,
      onboardNetwork: network,
      onboardProvider: provider,
      onboardWallet: wallet,
      connectWallet,
      disconnectWallet,
      reconnectWallet,
    }}
  >
    {children}
  </WalletContext.Provider>
}
