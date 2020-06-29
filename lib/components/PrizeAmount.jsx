import React from 'react'

import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const PrizeAmount = (
  props,
) => {
  const {
    pool
  } = props

  return <>
    <div className='uppercase text-xxxs sm:text-xxs font-bold'>Prize</div>
    <div className='text-sm sm:text-xl text-inverse'>
      ${numberWithCommas(pool.prize)} <span className='uppercase text-xxxs sm:text-xxs font-bold text-primary'> / {pool.frequency === 'Weekly' ? 'week' : 'day'}</span>
    </div>
  </>
}
