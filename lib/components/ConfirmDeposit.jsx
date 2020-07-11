import React from 'react'
import { useRouter } from 'next/router'

import { PaneTitle } from 'lib/components/PaneTitle'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'

export const ConfirmDeposit = (props) => {
  const { nextStep } = props

  if (window) {
    setTimeout(() => {
      nextStep()
    }, 4200)
  }

  const router = useRouter()
  const quantity = router.query.quantity

  return <>
    <PaneTitle small>
      {quantity} tickets
    </PaneTitle>

    <PaneTitle>
      Deposit confirming ...
    </PaneTitle>

    <PaneTitle small>
      Transactions may take a few minutes! Estimated wait time: 4 seconds
    </PaneTitle>

    <div className='mx-auto'>
      <V3LoadingDots />
    </div>
  </>
}
