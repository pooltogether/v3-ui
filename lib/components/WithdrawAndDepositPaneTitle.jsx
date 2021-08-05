import React from 'react'
import { TokenIcon } from '@pooltogether/react-components'

import { PaneTitle } from 'lib/components/PaneTitle'

export function WithdrawAndDepositPaneTitle(props) {
  const { label, symbol, address, chainId } = props

  return (
    <PaneTitle>
      <div className='font-bold inline-block sm:block relative mb-2' style={{ top: -2 }}>
        <TokenIcon chainId={chainId} address={address} className='w-10 h-10' />
      </div>{' '}
      {label}
    </PaneTitle>
  )
}
