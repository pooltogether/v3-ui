import React, { useState, useContext } from 'react'

import { Button } from 'lib/components/Button'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { MagicContext } from 'lib/components/contextProviders/MagicContextProvider'
import { WalletInfo } from 'lib/components/WalletInfo'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { shortenAddress } from 'lib/utils/shortenAddress'

export default function Dashboard(props) {
  const authControllerContext = useContext(AuthControllerContext)
  const magicContext = useContext(MagicContext)
  const { signOut, signedIn, magic, address, email } = magicContext

  return <>
    <div
      className='px-2 py-4 sm:py-2 text-center rounded-lg'
    >
      <h1
        className='text-inverse mb-10'
      >
        Account Dashboard
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
        <div className='mt-16'>
          <Button
            outline
            onClick={authControllerContext.signOut}
          >
            Sign out
          </Button>
        </div>
      </>}
    </div>
  </>
}
