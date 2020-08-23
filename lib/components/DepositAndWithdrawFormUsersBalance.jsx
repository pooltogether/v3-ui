import React from 'react'

import { PoolCountUp } from 'lib/components/PoolCountUp'

export const DepositAndWithdrawFormUsersBalance = (
  props,
) => {
  const { label, start, end, units } = props

  return <>
    <div
      className='flex text-inverse items-center justify-between w-full xs:w-10/12 sm:w-9/12 lg:w-9/12 mx-auto bg-primary border-b-2 border-accent-4 px-6 py-3 rounded-tl-lg rounded-tr-lg'
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
