import React, { useContext } from 'react'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ButtonLink } from 'lib/components/ButtonLink'
import { PaneTitle } from 'lib/components/PaneTitle'
import { formatFutureDateInSeconds } from 'lib/utils/formatFutureDateInSeconds'

export const WithdrawComplete = (props) => {
  const { t } = useTranslation()

  const router = useRouter()

  const quantity = router.query.quantity
  const withdrawType = router.query.withdrawType
  const timelockDuration = router.query.timelockDuration
  const fee = router.query.fee
  const net = router.query.net

  const scheduledWithdrawal = withdrawType && withdrawType === 'scheduled'
  const instantNoFee = withdrawType === 'instantNoFee'

  let formattedFutureDate
  if (timelockDuration) {
    formattedFutureDate = formatFutureDateInSeconds(
      Number(timelockDuration)
    )
  }

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const underlyingCollateralSymbol = pool && pool.underlyingCollateralSymbol
  const tickerUpcased = underlyingCollateralSymbol && underlyingCollateralSymbol.toUpperCase()

  if (!withdrawType) {
    return null
  }

  const handleShowAccount = (e) => {
    e.preventDefault()

    router.push('/account', '/account', { shallow: true })
  }

  // TODO: show what happened here!
  // 3. your new odds are:

  // 'Successfully scheduled your withdrawal'
  // 'Successfully withdrew'
  return <>
    <PaneTitle small>
      {scheduledWithdrawal ?
        t('successfullyScheduledYourWithdrawal')  :
        t('successfullyWithdrew')
      }
    </PaneTitle>

    <PaneTitle>
      {scheduledWithdrawal || instantNoFee ? <>
        {t('amountTickerEqualsAmountTickets', {
          amount: quantity,
          ticker: tickerUpcased
        })}
        {/* ${quantity} {tickerUpcased} = {quantity} tickets */}
      </> : <>
        {t('youReceivedAmountTicker', {
          amount: net,
          ticker: tickerUpcased
        })}
        
      </>}
    </PaneTitle>

    {!instantNoFee && <>
      <div className='-mt-6 mb-10'>
        <PaneTitle small>
          {scheduledWithdrawal ? <>
            {t('yourFundsWillBeReadyInDate', { date: formattedFutureDate })}
          </> : <>
            {t('andForfeitedAFairnessFeeOfAmountTicker', {
              amount: fee,
              ticker: tickerUpcased
            })}
          </>}
        </PaneTitle>
      </div>
    </>}

    <div>
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
