import React, { useContext } from 'react'
import { useRouter } from 'next/router'

import { Trans, useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ButtonLink } from 'lib/components/ButtonLink'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { formatFutureDateInSeconds } from 'lib/utils/formatFutureDateInSeconds'

export const WithdrawComplete = (props) => {
  const { t } = useTranslation()

  const router = useRouter()

  const quantity = router.query.quantity
  const withdrawType = router.query.withdrawType
  const timelockDurationSeconds = router.query.timelockDurationSeconds
  const fee = router.query.fee
  const net = router.query.net

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData
  
  const decimals = pool?.underlyingCollateralDecimals

  const netFormatted = displayAmountInEther(
    net,
    { decimals, precision: 8 }
  )
  const feeFormatted = displayAmountInEther(
    fee,
    { decimals, precision: 8 }
  )

  const scheduledWithdrawal = withdrawType && withdrawType === 'scheduled'
  const instantNoFee = withdrawType === 'instantNoFee'

  let formattedFutureDate
  if (timelockDurationSeconds) {
    formattedFutureDate = formatFutureDateInSeconds(
      Number(timelockDurationSeconds)
    )
  }

  const underlyingCollateralSymbol = pool?.underlyingCollateralSymbol
  const tickerUpcased = underlyingCollateralSymbol?.toUpperCase()

  if (!withdrawType) {
    return null
  }

  // const handleShowAccount = (e) => {
  //   e.preventDefault()

  //   router.push('/account', '/account', { shallow: true })
  // }

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
        <Trans
          i18nKey='amountTickerEqualsAmountTickets'
          defaults='You received <number>{{amount}}</number> {{ticker}}'
          components={{
            number: <PoolNumber />,
          }}
          values={{
            amount: quantity,
            ticker: tickerUpcased
          }}
        />
      </> : <>
        <Trans
          i18nKey='youReceivedAmountTicker'
          defaults='You received <number>{{amount}}</number> {{ticker}}'
          components={{
            number: <PoolNumber />,
          }}
          values={{
            amount: netFormatted,
            ticker: tickerUpcased,
          }}
        />
      </>}
    </PaneTitle>

    {!instantNoFee && <>
      <div className='-mt-6 mb-10 text-blue font-bold text-lg'>
        {scheduledWithdrawal ? <>
          {t('yourFundsWillBeReadyInDate', { date: formattedFutureDate })}
        </> : <>
          <Trans
            i18nKey='andForfeitedAFairnessFeeOfAmountTicker'
            defaults='... and forfeited a fairness fee of <number>{{amount}}</number> {{ticker}} to the pool'
            components={{
              number: <PoolNumber />,
            }}
            values={{
              amount: feeFormatted,
              ticker: tickerUpcased
            }}
          />
        </>}
      </div>
    </>}

    <div>
      <ButtonLink
        href='/account/pools/[symbol]'
        as={`/account/pools/${pool?.symbol}`}
        textSize='lg'
      >
        {t('continue')}
      </ButtonLink>
      {/* <ButtonLink
        href='/account'
        as='/account'
        textSize='lg'
      >
        {t('viewYourAccount')}
      </ButtonLink> */}
    </div>
  </>
}
