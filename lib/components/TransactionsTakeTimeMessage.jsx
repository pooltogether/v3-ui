import React from 'react'

import { V3LoadingDots } from 'lib/components/V3LoadingDots'

export const TransactionsTakeTimeMessage = (props) => {
  return <>
    <div className='mx-auto -mb-2'>
      <V3LoadingDots />
    </div>

    <div
      className='leading-tight font-bold text-base sm:text-lg lg:text-xl text-default-soft pb-2'
    >
      Transactions may take a few minutes
    </div>

    <div
      className='text-inverse'
    >
      <span
        className='font-bold'
      >
        Estimated wait time:
      </span> PUT actual estimate here?
    </div>
  </>
}
