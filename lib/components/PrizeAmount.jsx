import React from 'react'

import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PrizeAmount = (
  props,
) => {
  const {
    big,
    pool
  } = props

  const decimals = pool.underlyingCollateralDecimals

  let labelSize = 'text-xxxs sm:text-xxs'
  let amountSize = 'text-sm sm:text-lg'

  if (big) {
    labelSize = 'text-xs sm:text-xs lg:text-base'
    amountSize = 'text-3xl sm:text-3xl lg:text-5xl font-bold'
  }

  return <>
    <div
      className={`${labelSize} uppercase font-bold`}
    >
      Prize estimate
    </div>
    <div
      className={`${amountSize} text-inverse`}
    >
      <span
        className='font-number'
      >
        ${displayAmountInEther(pool.estimatePrize, { decimals })}
       {/* / week */}
      </span>
    </div>
  </>
}
