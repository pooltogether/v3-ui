import React from 'react'
import { useRouter } from 'next/router'

import { PaneTitle } from 'lib/components/PaneTitle'

export const OrderComplete = (props) => {
  const router = useRouter()
  const quantity = router.query.quantity

  return <>
    <PaneTitle small>
      You got {quantity} tickets!
    </PaneTitle>

    <PaneTitle>
      Deposit complete!
    </PaneTitle>

    <PaneTitle small>
      cue confetti
    </PaneTitle>
  </>
}
