// import App from 'next/app'
import React, { useContext, useEffect, useState } from 'react'
// import Onboard from 'bnc-onboard'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'

import { MagicContext } from 'lib/components/contextProviders/MagicContextProvider'

import { initOnboard } from 'lib/services/initOnboard'

import {
  COOKIE_OPTIONS,
  SELECTED_WALLET_COOKIE_KEY
} from 'lib/constants'

const debug = require('debug')('WalletContextProvider')

// const INFURA_KEY = process.env.NEXT_JS_INFURA_KEY
// const FORTMATIC_KEY = process.env.NEXT_JS_FORTMATIC_API_KEY


// // let networkName = 'mainnet'
// let networkName = 'kovan'
// const RPC_URL = (networkName && INFURA_KEY) ?
//   `https://${networkName}.infura.io/v3/${INFURA_KEY}` :
//   'http://localhost:8545'

// let cookieOptions = { sameSite: 'strict' }
// if (process.env.NEXT_JS_DOMAIN_NAME) {
//   cookieOptions = {
//     ...cookieOptions,
//     domain: `.${process.env.NEXT_JS_DOMAIN_NAME}`
//   }
// }

// const WALLETS_CONFIG = [
//   { walletName: "coinbase", preferred: true },
//   { walletName: "trust", preferred: true, rpcUrl: RPC_URL },
//   { walletName: "metamask", preferred: true },
//   { walletName: "dapper" },
//   // {
//   //   walletName: 'trezor',
//   //   appUrl: APP_URL,
//   //   email: CONTACT_EMAIL,
//   //   rpcUrl: RPC_URL,
//   //   preferred: true
//   // },
//   {
//     walletName: 'ledger',
//     rpcUrl: RPC_URL,
//     preferred: true
//   },
//   {
//     walletName: "fortmatic",
//     apiKey: FORTMATIC_KEY,
//     preferred: true
//   },
//   {
//     walletName: "authereum",
//     preferred: true
//   },
//   {
//     walletName: "walletConnect",
//     infuraKey: INFURA_KEY,
//     preferred: true
//   },
//   { walletName: "torus" },
//   { walletName: "status" },
//   { walletName: "unilogin" },
//   {
//     walletName: "walletLink",
//     rpcUrl: RPC_URL,
//     preferred: true
//   },
//   {
//     walletName: "imToken",
//     rpcUrl: RPC_URL
//   }
// ]

let provider

export const WalletContext = React.createContext()

export const WalletContextProvider = (props) => {
  const {
    children,
    postConnectCallback,
    // postConnectCallback,
  } = props

  const [address, setAddress] = useState(null)
  const [network, setNetwork] = useState(null)
  const [balance, setBalance] = useState(null)
  const [wallet, setWallet] = useState({})
  
  const [onboard, setOnboard] = useState(null)
  // const [walletState, setWalletState] = useState()

  const magicContext = useContext(MagicContext)
  const { magic } = magicContext

  // const afterConnect = () => {
  //   // postConnectCallback()
  //   postConnectCallback()

  //   if (magic) {
  //     magicContext.signOut()
  //   }
  // }


  // const connectWallet = (w, setWalletState) => {
  //   Cookies.set(
  //     SELECTED_WALLET_COOKIE_KEY,
  //     w.name,
  //     COOKIE_OPTIONS
  //   )

  //   const provider = new ethers.providers.Web3Provider(w.provider)

  //   setWalletState(previousState => ({
  //     ...previousState,
  //     address: undefined,
  //     wallet: w,
  //     provider
  //   }))
  // }


  // const addressChangedCallback = (setWalletState) => {
  //   if (typeof window === 'undefined' || !window._onboard) {
  //     debug('addressChangedCallback but no onboard object on window!')
  //     return null
  //   }
  //   // if (!onboard) {
  //   //   return null
  //   // }

  //   debug('running addressChangedCallback')
  //   const currentState = window._onboard.getState()

  //   try {
  //     const provider = currentState.wallet.provider
  //     let address = null

  //     if (provider) {
  //       address = provider.selectedAddress
  //       debug('setting address to: ', address)
  //     } else {
  //       debug('no provider, setting address: to null')
  //     }

  //     // trigger re-render
  //     setWalletState(previousState => ({
  //       ...previousState,
  //       address,
  //       timestamp: Date.now()
  //     }))
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }

  const disconnectWallet = () => {
    // if (typeof window === 'undefined' || !window._onboard) {
    //   debug('disconnectWallet but no onboard object on window!')
    //   return null
    // }
    // const currentState = window._onboard.getState()

    // if (address) {
      onboard.walletReset()

      Cookies.remove(
        SELECTED_WALLET_COOKIE_KEY,
        COOKIE_OPTIONS
      )

      // setWalletState(previousState => ({
      //   ...previousState,
      //   address: undefined,
      //   wallet: undefined,
      //   provider: undefined,
      // }))
    // }
  }

  // const initializeOnboard = (
  //   setWalletState,
  //   disconnectWallet,
  //   postConnectCallback,
  //   // postConnectCallback,
  // ) => {

  useEffect(() => {
    const onboard = initOnboard({
      address: setAddress,
      network: setNetwork,
      balance: setBalance,
      wallet: wallet => {
        if (wallet.provider) {
          postConnectCallback()

          if (magic) {
            magicContext.signOut()
          }

          setWallet(wallet)

          // const ethersProvider = new ethers.providers.Web3Provider(
          //   wallet.provider
          // )

          // provider = ethersProvider

          // internalTransferContract = new ethers.Contract(
          //   '0xb8c12850827ded46b9ded8c1b6373da0c4d60370',
          //   internalTransferABI,
          //   getSigner(ethersProvider)
          // )

          // window.localStorage.setItem('selectedWallet', wallet.name)

          Cookies.set(
            SELECTED_WALLET_COOKIE_KEY,
            wallet.name,
            COOKIE_OPTIONS
          )

          provider = new ethers.providers.Web3Provider(wallet.provider)
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

    setOnboard(onboard)
  }, [])

    // return Onboard({
    //   networkId: networkNameToChainId(networkName),
    //   darkMode: true,
    //   walletSelect: {
    //     wallets: WALLETS_CONFIG,
    //   },
    //   subscriptions: {
    //     address: async (a) => {
    //       debug('address change')
    //       debug(a)
    //       addressChangedCallback(setWalletState)
    //     },
    //     balance: async (balance) => {
    //       setWalletState(previousState => ({
    //         ...previousState,
    //         // onboard: _onboard,
    //         timestamp: Date.now(),
    //       }))
    //     },
    //     network: async (n) => {
    //       debug('network change')
    //       debug('new network id', n)
    //       if (typeof window === 'undefined' || !window._onboard) {
    //         return null
    //       }
          
    //       await window._onboard.config({ networkId: n })
    //       setWalletState(previousState => ({
    //         ...previousState,
    //         network: n
    //       }))
    //     },
    //     wallet: w => {
    //       debug({ w })
    //       if (!w.name) {
    //         disconnectWallet()
    //         postConnectCallback()
    //       } else {
    //         connectWallet(w, setWalletState)
    //         // addressChangedCallback(setWalletState)
    //         // postConnectCallback()
    //       }
    //     }
    //   }
    // })
  // }

  // useEffect(() => {
  //   debug('doInitOnboard start')
  //   const doInitOnboard = () => {
  //     debug('doInitOnboard inside')
  //     if (!onboard) {
  //       const ob = initializeOnboard(
  //         setWalletState,
  //         disconnectWallet,
  //         afterConnect,
  //         // afterConnect,
  //       )
  //       debug('re-init onboard')
  //       window._onboard = ob

  //       setOnboard(ob)

  //       // setWalletState(previousState => ({
  //       //   ...previousState,
  //       //   onboard: _onboard
  //       // }))
  //     }
  //   }
    
  //   doInitOnboard()
  // }, [])

  

  // if (!walletState) {
  //   initializeOnboard(
  //     setWalletState,
  //     disconnectWallet,
  //     afterConnect,
  //     // afterConnect,
  //   )

  //   setWalletState(previousState => ({
  //     ...previousState,
  //     onboard: _onboard
  //   }))
  // }

  const connectWallet = async (
    postSignInCallback
  ) => {
    await onboard.walletSelect()

    if (onboard.getState().wallet.type) {
      await onboard.walletCheck()
      debug({ currentState: onboard.getState() })

      // trigger re-render
      // setWalletState(previousState => ({
      //   ...previousState,
      //   timestamp: Date.now()
      // }))

      if (postSignInCallback) {
        postSignInCallback()
      }
    }
  }
  
  

  // const handleShowOnboard = (postSignInCallback) => {
    // if (walletState) {
      // connectWallet(postSignInCallback)
    // }
  // }

  // debug('re-render')
  // if (onboard) {
    // const currentState = onboard.getState()
    // debug('currentState', currentState)
  // }

  // useEffect(() => {
  //   // const previouslySelectedWallet = window.localStorage.getItem(
  //   //   'selectedWallet'
  //   // )

  //   if (previouslySelectedWallet && onboard) {
  //     onboard.walletSelect(previouslySelectedWallet)
  //   }
  // }, [onboard])

  // useEffect(() => {
  //   const previouslySelectedWallet = window.localStorage.getItem(
  //     'selectedWallet'
  //   )

  //   if (previouslySelectedWallet && onboard) {
  //     onboard.walletSelect(previouslySelectedWallet)
  //   }
  // }, [onboard])

  const reconnectWallet = (previouslySelectedWallet) => {
    console.log({ previouslySelectedWallet})
    console.log({ onboard})
    if (previouslySelectedWallet && onboard) {
      console.log('re-connect wallet')
      onboard.walletSelect(previouslySelectedWallet)
    }
  }
  // }, [onboard])


  return <WalletContext.Provider
    value={{
      address,
      balance,
      wallet,
      network,
      provider,
      // handleShowOnboard,
      disconnectWallet,
      connectWallet,
      reconnectWallet,
      // walletState,
      onboard
    }}
  >
    {children}
  </WalletContext.Provider>
}
