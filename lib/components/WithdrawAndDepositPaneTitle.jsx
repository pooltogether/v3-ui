import React from 'react'

import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'

export function WithdrawAndDepositPaneTitle(props) {
  const { label, symbol, address } = props

  return (
    <PaneTitle>
      <div className='font-bold inline-block sm:block relative mb-2' style={{ top: -2 }}>
        <PoolCurrencyIcon lg symbol={symbol} address={address} />
      </div>{' '}
      {label}
    </PaneTitle>
  )
}
