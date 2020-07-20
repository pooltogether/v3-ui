import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { ConfettiContext } from 'lib/components/contextProviders/ConfettiContextProvider'
import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'

export const WithdrawComplete = (props) => {
  const router = useRouter()
  const quantity = router.query.quantity
  const prizePoolTicker = router.query.prizePoolTicker
  if (!prizePoolTicker) {
    return null
  }
  const ticker = router.query.prizePoolTicker.toUpperCase()

  const confettiContext = useContext(ConfettiContext)
  const { confetti } = confettiContext

  useEffect(() => {
    setTimeout(() => {
      window.confettiContext = confetti
      confetti.start(setTimeout, setInterval)
    }, 300)
  }, [])

  const handleShowAccount = (e) => {
    e.preventDefault()

    router.push('/account', '/account', { shallow: true })
  }

  return <>
    <PaneTitle small>
      Successfully withdrawn
    </PaneTitle>

    <PaneTitle>
      {quantity} {ticker} = {quantity} tickets
    </PaneTitle>

    <div>
      <Button
        size='lg'
        className='w-64'
        onClick={handleShowAccount}
      >
        View your account
      </Button>
    </div>
  </>
}
