// import App from 'next/app'
import React, { useContext, useState } from 'react'
import Onboard from 'bnc-onboard'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'

import { MagicContext } from 'lib/components/contextProviders/MagicContextProvider'

import { networkNameToChainId } from 'lib/utils/networkNameToChainId'

import {
  SELECTED_WALLET_COOKIE_KEY
} from 'lib/constants'

const debug = require('debug')('WalletContextProvider')

const INFURA_KEY = process.env.NEXT_JS_INFURA_KEY
const FORTMATIC_KEY = process.env.NEXT_JS_FORTMATIC_API_KEY


// let networkName = 'mainnet'
let networkName = 'kovan'
const RPC_URL = (networkName && INFURA_KEY) ?
  `https://${networkName}.infura.io/v3/${INFURA_KEY}` :
  'http://localhost:8545'

let cookieOptions = { sameSite: 'strict' }
if (process.env.NEXT_JS_DOMAIN_NAME) {
  cookieOptions = {
    ...cookieOptions,
    domain: `.${process.env.NEXT_JS_DOMAIN_NAME}`
  }
}

const WALLETS_CONFIG = [
  { walletName: "coinbase", preferred: true },
  { walletName: "trust", preferred: true, rpcUrl: RPC_URL },
  { walletName: "metamask", preferred: true },
  { walletName: "dapper" },
  // {
  //   walletName: 'trezor',
  //   appUrl: APP_URL,
  //   email: CONTACT_EMAIL,
  //   rpcUrl: RPC_URL,
  //   preferred: true
  // },
  {
    walletName: 'ledger',
    rpcUrl: RPC_URL,
    preferred: true
  },
  {
    walletName: "fortmatic",
    apiKey: FORTMATIC_KEY,
    preferred: true
  },
  {
    walletName: "authereum",
    preferred: true
  },
  {
    walletName: "walletConnect",
    infuraKey: INFURA_KEY,
    preferred: true
  },
  { walletName: "torus" },
  { walletName: "status" },
  { walletName: "unilogin" },
  {
    walletName: "walletLink",
    rpcUrl: RPC_URL,
    preferred: true
  },
  {
    walletName: "imToken",
    rpcUrl: RPC_URL
  }
]

export const WalletContext = React.createContext()

let _onboard

const initializeOnboard = (
  setOnboardState,
  disconnectWallet,
  postConnectCallback,
  postDisconnectCallback,
) => {
  _onboard = Onboard({
    networkId: networkNameToChainId(networkName),
    darkMode: true,
    walletSelect: {
      wallets: WALLETS_CONFIG,
    },
    subscriptions: {
      address: async (a) => {
        debug('address change')
        debug(a)
        setAddress(setOnboardState)
      },
      balance: async (balance) => {
        setOnboardState(previousState => ({
          ...previousState,
          onboard: _onboard,
          timestamp: Date.now(),
        }))
      },
      network: async (n) => {
        debug('network change')
        debug('new network id', n)
        await _onboard.config({ networkId: n })
        setOnboardState(previousState => ({
          ...previousState,
          network: n
        }))
      },
      wallet: w => {
        debug({ w })
        if (!w.name) {
          disconnectWallet()
          postDisconnectCallback()
        } else {
          connectWallet(w, setOnboardState)
          setAddress(setOnboardState)
          postConnectCallback()
        }
      }
    }
  })
}

const connectWallet = (w, setOnboardState) => {
  Cookies.set(
    SELECTED_WALLET_COOKIE_KEY,
    w.name,
    cookieOptions
  )

  const provider = new ethers.providers.Web3Provider(w.provider)
  // console.log('setting provider')
  // console.log(provider)

  setOnboardState(previousState => ({
    ...previousState,
    address: undefined,
    wallet: w,
    provider
  }))
}

const setAddress = (setOnboardState) => {
  debug('running setAddress')
  const currentState = _onboard.getState()

  try {
    const provider = currentState.wallet.provider
    let address = null

    if (provider) {
      address = provider.selectedAddress
      debug('setting address to: ', address)
    } else {
      debug('no provider, setting address: to null')
    }

    // trigger re-render
    setOnboardState(previousState => ({
      ...previousState,
      address,
      timestamp: Date.now()
    }))
  } catch (e) {
    console.error(e)
  }
}

export const WalletContextProvider = (props) => {
  const {
    children,
    postDisconnectCallback,
    postConnectCallback,
  } = props
  const [onboardState, setOnboardState] = useState()

  const magicContext = useContext(MagicContext)
  const { magic } = magicContext

  const afterConnect = () => {
    postConnectCallback()

    if (magic) {
      magicContext.signOut()
    }
  }

  // walletType is optional here:
  const doConnectWallet = async (
    walletType,
  ) => {
    await _onboard.walletSelect(walletType)
    const currentState = _onboard.getState()
    debug({ currentState })

    if (currentState.wallet.type) {
      debug("run walletCheck")
      await _onboard.walletCheck()
      debug("walletCheck done")
      debug({ currentState: _onboard.getState() })

      // trigger re-render
      setOnboardState(previousState => ({
        ...previousState,
        timestamp: Date.now()
      }))
    }
  }
  
  const disconnectWallet = () => {
    const currentState = _onboard.getState()

    if (currentState.address) {
      _onboard.walletReset()
      
      Cookies.remove(
        SELECTED_WALLET_COOKIE_KEY,
        cookieOptions
      )

      setOnboardState(previousState => ({
        ...previousState,
        address: undefined,
        wallet: undefined,
        provider: undefined,
      }))
    }
  }

  if (!onboardState) {
    initializeOnboard(
      setOnboardState,
      disconnectWallet,
      afterConnect,
      afterConnect,
    )

    setOnboardState(previousState => ({
      ...previousState,
      onboard: _onboard
    }))
  }

  const handleShowOnboard = () => {
    if (onboardState) {
      doConnectWallet(null)
    }
  }

  debug('re-render')

  return <WalletContext.Provider
    value={{
      handleShowOnboard,
      disconnectWallet,
      doConnectWallet,
      state: onboardState,
      _onboard
    }}
  >
    {children}
  </WalletContext.Provider>
}
