import React from 'react'

import { PoolCountUp } from 'lib/components/PoolCountUp'

export const DepositAndWithdrawFormUsersBalance = (
  props,
) => {
  const { label, start, end, units } = props

  return <>
    <div
      className='flex text-inverse items-center justify-between w-full sm:w-9/12 lg:w-9/12 mx-auto border-2 p-3'
    >
      <div>
        {label || 'Your balance:'}
      </div>
      <div>
        <PoolCountUp
          {...props}
          start={start}
          end={end}
          decimals={2}
        /> {units}
      </div>
    </div>
  </>
}
