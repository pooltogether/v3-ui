import React from 'react'
import Link from 'next/link'
import { Trans, useTranslation } from 'react-i18next'
import { Amount, ButtonLink, Card } from '@pooltogether/react-components'
import { useIsWalletMetamask } from '@pooltogether/hooks'
import { getTimeBreakdown, numberWithCommas } from '@pooltogether/utilities'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'

import { useConfetti } from 'lib/hooks/useConfetti'
import { AddTokenToMetaMaskButton } from 'lib/components/AddTokenToMetaMaskButton'
import { getTimeSentence } from 'lib/utils/getTimeSentence'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'

export const DepositReceipt = (props) => {
  const {
    quantity,
    ticketAddress,
    ticketDecimals,
    ticketSymbol,
    prizePeriodSeconds,
    prizePeriodStartedAt,
    isRngRequested,
    message
  } = props
  const { t } = useTranslation()

  const { wallet } = useOnboard()
  const isWalletMetamask = useIsWalletMetamask(wallet)

  useConfetti()

  const { years, weeks, days, hours, minutes, seconds } = getTimeBreakdown(
    prizePeriodSeconds.toString()
  )

  return (
    <>
      <span className='mx-auto text-xl mb-4' role='img' aria-label='confetti emoji'>
        🎉🎉🎉
      </span>
      <span className='text-xl mb-10 font-bold'>{t('successfullyDeposited')}</span>
      <Card className='flex flex-col mx-auto mb-8' backgroundClassName='bg-accent-grey-1'>
        <h1 className='text-highlight-2'>
          <Trans
            i18nKey='AmountTickets'
            defaults='<number>{{amount}}</number> tickets'
            components={{
              number: <Amount />
            }}
            values={{
              amount: numberWithCommas(quantity)
            }}
          />
        </h1>

        {isWalletMetamask && (
          <div className='m-2'>
            <AddTokenToMetaMaskButton
              basic
              showPoolIcon
              textSize='xxxs'
              tokenAddress={ticketAddress}
              tokenDecimals={ticketDecimals}
              tokenSymbol={ticketSymbol}
            />
          </div>
        )}

        <div className='mb-4 text-highlight-2 text-sm'>
          {message && <div className='mt-4'>{message}</div>}

          <div className='mb-6'>
            {t('youWillBeEligibleToWinPrizeEveryFrequency', {
              frequency: getTimeSentence(t, years, weeks, days, hours, minutes, seconds, true)
            })}
          </div>
          <div className='mb-3 text-inverse'>
            {t('theNextPrizeWillBeAwardedIn')}
            <br />
            <div className='font-bold text-flashy'>
              <NewPrizeCountdownInWords
                prizePeriodSeconds={prizePeriodSeconds}
                prizePeriodStartedAt={prizePeriodStartedAt}
                isRngRequested={isRngRequested}
              />
            </div>
          </div>
        </div>
      </Card>
      <div className='mt-4'>
        <ButtonLink Link={Link} href='/account' as='/account' textSize='lg'>
          {t('viewYourAccount')}
        </ButtonLink>
      </div>
    </>
  )
}
