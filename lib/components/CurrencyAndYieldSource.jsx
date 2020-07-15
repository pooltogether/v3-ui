import React from 'react'

import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'

export const CurrencyAndYieldSource = (
  props,
) => {
  const {
    pool
  } = props

  return <>
    <PoolCurrencyIcon
      pool={pool}
    />
    <div
      className='bg-darkened rounded-lg px-2 uppercase text-xxs sm:text-sm font-bold mr-1'
    >
      {pool.underlyingCollateralSymbol}
    </div>
    {/* <div
      className='bg-darkened rounded-lg px-2 uppercase text-xxs sm:text-sm font-bold mr-1'
    >
      {pool.yieldSource}
    </div> */}
  </>
}
