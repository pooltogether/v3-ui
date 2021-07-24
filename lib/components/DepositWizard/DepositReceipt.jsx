import React, { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Amount, ButtonLink, Card } from '@pooltogether/react-components'
import { useIsWalletMetamask } from '@pooltogether/hooks'
import { getTimeBreakdown, numberWithCommas } from '@pooltogether/utilities'

import { useConfetti } from 'lib/hooks/useConfetti'
import { AddTokenToMetaMaskButton } from 'lib/components/AddTokenToMetaMaskButton'
import { getTimeSentence } from 'lib/utils/getTimeSentence'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'
import Link from 'next/link'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

export const DepositReceipt = (props) => {
  const {
    quantity,
    prevUnderlyingBalance,
    prevTicketBalance,
    ticketAddress,
    ticketDecimals,
    ticketSymbol,
    underlyingTokenSymbol,
    prizePeriodSeconds,
    prizePeriodStartedAt,
    isRngRequested
  } = props

  useConfetti()
  const isWalletMetamask = useIsWalletMetamask()
  const { t } = useTranslation()

  const { years, weeks, days, hours, minutes, seconds } = getTimeBreakdown(
    prizePeriodSeconds.toString()
  )

  const balance = formatUnits(
    parseUnits(quantity, ticketDecimals).add(parseUnits(prevTicketBalance, ticketDecimals)),
    ticketDecimals
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
          <div className='mt-4'>
            {t('youNowHaveAmountTicketsInTheTickerPod', {
              amount: numberWithCommas(balance),
              ticker: underlyingTokenSymbol
            })}
          </div>
          <div className='mb-6'>
            {t('youWillBeEligibleToWinPrizeEveryFrequency', {
              frequency: getTimeSentence(t, years, weeks, days, hours, minutes, seconds)
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
