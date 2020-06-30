import React, { useState, useContext } from 'react'

import { MagicContext } from 'lib/components/contextProviders/MagicContextProvider'
import { WalletInfo } from 'lib/components/WalletInfo'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { shortenAddress } from 'lib/utils/shortenAddress'

export default function Dashboard(props) {
  const magicContext = useContext(MagicContext)
  const { signOut, signedIn, magic, address, email } = magicContext

  // router.push('/?signIn=1', '/?signIn=1')

  return <>
    <div
      className='px-2 py-4 sm:py-2 text-center rounded-lg'
    >
      <h1
        className='text-inverse mb-10'
      >
        Dashboard
      </h1>

      <WalletInfo
        {...props}
      />

      {magic && signedIn && <>
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
          className='text-default-soft mt-10'
        >
          Magic ETH Address:
        </h2>
        <h2
          className='text-secondary'
        >
          {shortenAddress(address)}
        </h2>

        {/* <h2
          className='text-default-soft mt-10'
        >
          Magic ETH Balance:
        </h2>
        <h2
          className='text-secondary'
        >
          {displayAmountInEther(ethBalance)}
        </h2> */}
      </>}

      {magic && signedIn && <>
        <button
          className='mt-16 rounded-full text-secondary border-2 border-secondary hover:text-inverse hover:bg-primary text-xxs sm:text-base py-1 sm:py-2 px-3 sm:px-6 trans tracking-wider outline-none focus:outline-none active:outline-none'
          onClick={signOut}
        >
          Sign out
        </button>
      </>}
    </div>
  </>
}
