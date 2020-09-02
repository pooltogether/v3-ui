import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ConfettiContext } from 'lib/components/contextProviders/ConfettiContextProvider'
import { ButtonLink } from 'lib/components/ButtonLink'
import { PaneTitle } from 'lib/components/PaneTitle'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const OrderComplete = (props) => {
  const router = useRouter()
  const quantity = router.query.quantity

  const confettiContext = useContext(ConfettiContext)
  const { confetti } = confettiContext

  const poolData = useContext(PoolDataContext)
  const { pool, usersTicketBalance } = poolData

  useEffect(() => {
    setTimeout(() => {
      window.confettiContext = confetti
      confetti.start(setTimeout, setInterval)
    }, 300)
  }, [])

  // prevents flashing when unmounting
  if (!quantity) {
    return null
  }

  return <>
    <PaneTitle small>
      Deposit complete
    </PaneTitle>

    <PaneTitle>
      You got {quantity} tickets!
    </PaneTitle>

    <div
      className='mb-6 text-highlight-3 text-sm xs:text-base sm:text-lg font-bold'
    >
      <div
        className='mb-6'
      >
        You now have {numberWithCommas(usersTicketBalance)} tickets in the {pool?.underlyingCollateralSymbol} pool!
      </div>
      <div
        className='mb-6'
      >
        You will be eligible to win a prize every {pool?.frequency === 'Weekly' ? 'week' : 'day'}
      </div>
      <div
        className='mb-3'
      >
        The next prize will be awarded in: <NewPrizeCountdownInWords
          pool={pool}
        />
      </div>
    </div>

    <div>
      <ButtonLink
        href='/account'
        as='/account'
        textSize='lg'
      >
        View your account
      </ButtonLink>
    </div>
  </>
}
