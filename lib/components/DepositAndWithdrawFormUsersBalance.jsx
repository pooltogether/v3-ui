import React from 'react'

import { PoolCountUp } from 'lib/components/PoolCountUp'

export const DepositAndWithdrawFormUsersBalance = (
  props,
) => {
  const { label, start, end } = props
  
  return <>
    <div
      className='flex text-inverse items-center justify-between w-9/12 sm:w-7/12 lg:w-1/3 mx-auto border-2 p-3'
    >
      <div>
        {label || 'Your balance:'}
      </div>
      <PoolCountUp
        start={start}
        end={end}
        decimals={2}
      />
    </div>
  </>
}
