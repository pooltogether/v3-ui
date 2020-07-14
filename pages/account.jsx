import React, { useContext } from 'react'

import { WalletInfo } from 'lib/components/WalletInfo'

export default function Account(props) {
  return <>
    <div
      className='px-2 py-4 sm:py-2 text-center rounded-lg'
    >
      <h1
        className='text-inverse mb-10'
      >
        Your account
      </h1>

      <WalletInfo
        {...props}
      />
    </div>
  </>
}
