import React from 'react'

import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const PrizeAmount = (
  props,
) => {
  const {
    big,
    pool
  } = props

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
        ${numberWithCommas(pool.estimatePrize)}
      </span> <span
        className={`${labelSize} uppercase font-bold text-primary`}
      >
        /
        {/* / {pool.frequency === 'Weekly' ? 'week' : 'day'} */}
      </span>
    </div>
  </>
}
