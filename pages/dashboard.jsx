import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { Magic } from 'magic-sdk'
import { useRouter } from 'next/router'

import {
  COOKIE_OPTIONS,
  MAGIC_IS_LOGGED_IN,
  MAGIC_EMAIL
} from 'lib/constants'

export default function Dashboard(props) {
  const [address, setAddress] = useState('')
  const router = useRouter()
  const email = Cookies.get(MAGIC_EMAIL)

  const networkName = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME

  const magic = new Magic(
    process.env.NEXT_JS_MAGIC_PUB_KEY,
    { network: networkName === 'homestead' ? 'mainnet' : networkName }
  )

  console.log({ magic })

  const handleSignOut = async (e) => {
    e.preventDefault()

    // if (await magic.user.isLoggedIn()) {
      const logout = await magic.user.logout()
      console.log({ logout })
      
      Cookies.set(
        MAGIC_IS_LOGGED_IN,
        false,
        COOKIE_OPTIONS
      )
    // }

    router.push('/', '/')
    router.reload()
  }

  useEffect(() => {
    const getMagicUser = async () => {
      const _provider = new ethers.providers.Web3Provider(
        magic.rpcProvider,
        process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME
      )
      console.log(_provider)

      // const provider = await this.provider()
      setAddress(await _provider.getSigner().getAddress())
      // const ethBalance = await provider.getBalance(address)
    }
    getMagicUser()

  })

  
  return <>
    <div
      className='px-2 py-4 sm:py-2 text-center rounded-lg'
    >
      <h1
        className='text-inverse'
      >
        Dashboard
      </h1>

      <h2
        className='text-default-soft'
      >
        Magic Email:
      </h2>
      <h2
        className='text-secondary'
      >
        {email}
      </h2>

      <h2
        className='text-default-soft'
      >
        Magic ETH Address:
      </h2>
      <h2
        className='text-secondary'
      >
        {address}
      </h2>

      <button
        className='mt-10 rounded-full text-secondary border-2 border-secondary hover:text-inverse hover:bg-primary text-xxs sm:text-base py-1 sm:py-2 px-3 sm:px-6 trans tracking-wider'
        onClick={handleSignOut}
      >
        Sign out
      </button>
    </div>
  </>
}
