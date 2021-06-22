import React from 'react'

import { PoolNumber } from 'lib/components/PoolNumber'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export function WithdrawAndDepositBanner(props) {
  const { label, quantity, tickerUpcased } = props

  return (
    <div className='pool-gradient-2 text-white w-full justify-center mx-auto mb-4 px-3 py-3 xs:py-6 rounded-full text-lg xs:text-xl flex flex-col sm:flex-row'>
      <span className='sm:mr-4'>{label}</span>
      <div>
        <PoolNumber>{numberWithCommas(quantity)}</PoolNumber> {tickerUpcased}
      </div> 
    </div>
  )
}
