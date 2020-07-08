import React, { useState, useContext } from 'react'

import { Button } from 'lib/components/Button'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { MagicContext } from 'lib/components/contextProviders/MagicContextProvider'
import { WalletInfo } from 'lib/components/WalletInfo'

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

    </div>
  </>
}
