import React, { useEffect, useState, useContext } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { Magic, RPCError, RPCErrorCode } from 'magic-sdk'

import {
  COOKIE_OPTIONS,
  MAGIC_EMAIL,
} from 'lib/constants'
import { poolToast } from 'lib/utils/poolToast'

export const MagicContext = React.createContext()

export const MagicContextProvider = (props) => {
  const router = useRouter()

  const [magic, setMagic] = useState()
  const [provider, setProvider] = useState()
  const [email, setEmail] = useState()
  const [address, setAddress] = useState()
  const [signedIn, setSignedIn] = useState(false)

  const networkName = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME

  const updateStateVars = async () => {
    const { email, publicAddress } = await magic.user.getMetadata()

    setSignedIn(true)

    setEmail(email)
    setAddress(publicAddress)
    // const [ethBalance, setEthBalance] = useState('')
    // const email = Cookies.get(MAGIC_EMAIL)

    Cookies.set(
      MAGIC_EMAIL,
      email,
      COOKIE_OPTIONS
    )
  }

  useEffect(() => {
    const m = new Magic(
      process.env.NEXT_JS_MAGIC_PUB_KEY,
      { network: networkName === 'homestead' ? 'mainnet' : networkName }
    )
    setMagic(m)

    setProvider(
      new ethers.providers.Web3Provider(
        m.rpcProvider,
        process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME
      )
    )
  }, [])


  useEffect(() => {
    const checkSignedIn = async () => {
      if (await magic.user.isLoggedIn()) {
        updateStateVars()
      }
    }

    if (magic && magic.user) {
      checkSignedIn()
    }
  }, [magic])

  const signOut = async (e) => {
    if (e) {
      e.preventDefault()
    }
    
    const logout = await magic.user.logout()
    if (logout) {
      setSignedIn(false)
    }
  }

  const signIn = async (formEmail) => {
    try {
      const did = await magic
        .auth
        .loginWithMagicLink({ email: formEmail })

      const isLoggedIn = await magic.user.isLoggedIn()

      // magic.user.updateEmail({ email, showUI?= true })

      if (isLoggedIn) {
        updateStateVars()
        
        router.push(
          `${router.pathname}`,
          `${router.asPath}`, {
            shallow: true
          }
        )
      }
    } catch (err) {
      console.error(err)
      poolToast.error(err.message)

      if (err instanceof RPCError) {
        switch (err.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
            break
          case RPCErrorCode.MagicLinkExpired:
            break
          case RPCErrorCode.MagicLinkRateLimited:
            break
          case RPCErrorCode.UserAlreadyLoggedIn:
            break
        }
      }
    }

  }

  return <MagicContext.Provider
    value={{
      address,
      provider,
      magic,
      email,
      signedIn,
      signIn,
      signOut,
    }}
  >
    {props.children}
  </MagicContext.Provider>
}
