import React from 'react'

import { PaneTitle } from 'lib/components/PaneTitle'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'

export const TransactionsTakeTimeMessage = (props) => {
  return <>
    <div className='mx-auto -mb-2'>
      <V3LoadingDots />
    </div>

    <PaneTitle small>
      Transactions may take a few minutes
      </PaneTitle>

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
