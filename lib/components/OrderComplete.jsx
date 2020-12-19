import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { Trans, useTranslation } from 'lib/../i18n'
import { usePool } from 'lib/hooks/usePool'
import { ConfettiContext } from 'lib/components/contextProviders/ConfettiContextProvider'
import { AccountEmailSignup } from 'lib/components/AccountEmailSignup'
import { ButtonLink } from 'lib/components/ButtonLink'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export function OrderComplete(props) {
  const [t] = useTranslation()

  const router = useRouter()
  const quantity = router.query.quantity
  let prevBalance = router.query.prevBalance

  const { confetti } = useContext(ConfettiContext)

  const { pool } = usePool()

  const decimals = pool?.underlyingCollateralDecimals
  if (prevBalance) {
    prevBalance = ethers.utils.formatUnits(
      prevBalance,
      decimals || 18
    )
  }

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
      {t('depositComplete')}
    </PaneTitle>

    <div className='-mt-2'>
      <PaneTitle>
        <Trans
          i18nKey='youGotAmountTickets'
          defaults='You got <number>{{amount}}</number> tickets!'
          components={{
            number: <PoolNumber />,
          }}
          values={{
            amount: quantity,
          }}
        />
      </PaneTitle>
    </div>

    <div
      className='mb-6 text-highlight-3 text-sm'
    >
      <div
        className='mb-6'
      >
        {t('youNowHaveAmountTicketsInTheTickerPool', {
          amount: numberWithCommas(Number(prevBalance) + Number(quantity), { precision: 4 }),
          ticker: pool?.underlyingCollateralSymbol
        })}
      </div>
      <div
        className='mb-6'
      >
        {t('youWillBeEligibleToWinPrizeEveryFrequency', {
          frequency: pool?.frequency === 'Weekly' ? t('week') : t('day')
        })}
      </div>
      <div
        className='mb-3'
      >
        {t('theNextPrizeWillBeAwardedIn')} 
        <div
          className='font-bold text-flashy'
        >
          <NewPrizeCountdownInWords
            pool={pool}
          />
        </div>
      </div>
    </div>

    <AccountEmailSignup />

    <div
      className='mt-4'
    >
      <ButtonLink
        href='/account'
        as='/account'
        textSize='lg'
      >
        {t('viewYourAccount')}
      </ButtonLink>
    </div>
  </>
}
