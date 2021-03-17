import React, { useContext, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import { COOKIE_OPTIONS, WIZARD_REFERRER_HREF, WIZARD_REFERRER_AS_PATH } from 'lib/constants'
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
    prevBalance = ethers.utils.formatUnits(prevBalance, decimals || 18)
  }

  useEffect(() => {
    Cookies.set(WIZARD_REFERRER_HREF, '/account', COOKIE_OPTIONS)
    Cookies.set(WIZARD_REFERRER_AS_PATH, `/account`, COOKIE_OPTIONS)
  }, [])

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

  return (
    <>
      <PaneTitle>
        <span className={`mx-auto`} role='img' aria-label='confetti emoji'>
          🎉
        </span>{' '}
        <span className={`mx-auto`} role='img' aria-label='confetti emoji'>
          🎉
        </span>{' '}
        <span className={`mx-auto`} role='img' aria-label='confetti emoji'>
          🎉
        </span>
      </PaneTitle>
      <PaneTitle>{t('successfullyDeposited')}</PaneTitle>

      <div className='border-highlight-2 border-2 bg-accent-grey-1 p-4 sm:p-8 my-4 sm:my-8 rounded-lg'>
        <h1 className='text-highlight-2'>
          <Trans
            i18nKey='AmountTickets'
            defaults='<number>{{amount}}</number> tickets'
            components={{
              number: <PoolNumber />
            }}
            values={{
              amount: numberWithCommas(quantity)
            }}
          />
        </h1>

        <div className='mb-4 text-highlight-2 text-sm'>
          <div className='mt-4'>
            {t('youNowHaveAmountTicketsInTheTickerPool', {
              amount: numberWithCommas(Number(prevBalance) + Number(quantity)),
              ticker: pool?.underlyingCollateralSymbol
            })}
          </div>
          <div className='mb-6'>
            {t('youWillBeEligibleToWinPrizeEveryFrequency', {
              frequency: t('week')
            })}
          </div>
          <div className='mb-3 text-inverse'>
            {t('theNextPrizeWillBeAwardedIn')}
            <br />
            <div className='font-bold text-flashy'>
              <NewPrizeCountdownInWords pool={pool} />
            </div>
          </div>
        </div>
      </div>

      <div className='mt-4'>
        <ButtonLink href='/account' as='/account' textSize='lg'>
          {t('viewYourAccount')}
        </ButtonLink>
      </div>
    </>
  )
}
