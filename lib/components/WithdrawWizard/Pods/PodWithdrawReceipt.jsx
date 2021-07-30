import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { numberWithCommas } from '@pooltogether/utilities'

import { WithdrawReceipt } from 'lib/components/WithdrawWizard/WithdrawReceipt'

export const PodWithdrawReceipt = (props) => {
  const { pod, prevTicketBalance, quantity } = props
  const { t } = useTranslation()

  const underlyingTokenSymbol = pod.tokens.underlyingToken.symbol
  const ticketDecimals = pod.tokens.underlyingToken.decimals
  const prizePeriodSeconds = pod.prize.prizePeriodSeconds
  const prizePeriodStartedAt = pod.prize.prizePeriodStartedAt
  const isRngRequested = pod.prize.isRngRequested

  const balance = formatUnits(
    parseUnits(prevTicketBalance, ticketDecimals).sub(parseUnits(quantity, ticketDecimals)),
    ticketDecimals
  )

  return (
    <WithdrawReceipt
      {...props}
      underlyingTokenSymbol={underlyingTokenSymbol}
      ticketDecimals={ticketDecimals}
      prizePeriodSeconds={prizePeriodSeconds}
      prizePeriodStartedAt={prizePeriodStartedAt}
      isRngRequested={isRngRequested}
      message={t('youNowHaveAmountTicketsInTheTickerPod', {
        amount: numberWithCommas(balance),
        ticker: underlyingTokenSymbol
      })}
    />
  )
}
