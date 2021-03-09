import React from 'react'
import { useRouter } from 'next/router'

import { PaneTitle } from 'lib/components/PaneTitle'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'

export function ConfirmFiatDeposit(props) {
  const { nextStep } = props

  if (window) {
    setTimeout(() => {
      nextStep()
    }, 1200)
  }

  const router = useRouter()
  const quantity = router.query.quantity

  return (
    <>
      <PaneTitle small>
        {t('forAmountTickets', {
          amount: quantity
        })}
      </PaneTitle>

      <PaneTitle>{t('depositConfirming')}</PaneTitle>

      <PaneTitle small>
        {/* {t('transactionsMayTakeAFewMinutes', {
        waitTime: ''
      })} */}
      </PaneTitle>

      <div className='mx-auto'>
        <V3LoadingDots />
      </div>
    </>
  )
}
