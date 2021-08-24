import React from 'react'
import classnames from 'classnames'

import { PoolNumber } from 'lib/components/PoolNumber'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export function WithdrawAndDepositBanner(props) {
  const { label, quantity, tickerUpcased, disabled } = props

  return (
    <div
      className={classnames(
        'pool-gradient-2 text-white w-full text-center mx-auto my-8 px-3 py-3 xs:py-6 rounded-full text-sm xs:text-base sm:text-xl lg:text-2xl relative'
      )}
    >
      <span className='mr-4'>{label}</span>
      <PoolNumber>{numberWithCommas(quantity)}</PoolNumber> {tickerUpcased}
    </div>
  )
}
