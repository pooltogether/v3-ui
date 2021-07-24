import { WithdrawReceipt } from 'lib/components/WithdrawWizard/WithdrawReceipt'
import React from 'react'

export const PodWithdrawReceipt = (props) => {
  const { pod } = props

  const underlyingTokenSymbol = pod.tokens.underlyingToken.symbol
  const ticketDecimals = pod.tokens.underlyingToken.decimals
  const prizePeriodSeconds = pod.prize.prizePeriodSeconds
  const prizePeriodStartedAt = pod.prize.prizePeriodStartedAt
  const isRngRequested = pod.prize.isRngRequested

  return (
    <WithdrawReceipt
      {...props}
      underlyingTokenSymbol={underlyingTokenSymbol}
      ticketDecimals={ticketDecimals}
      prizePeriodSeconds={prizePeriodSeconds}
      prizePeriodStartedAt={prizePeriodStartedAt}
      isRngRequested={isRngRequested}
    />
  )
}
