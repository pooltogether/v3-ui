import { DepositReceipt } from 'lib/components/DepositWizard/DepositReceipt'
import React from 'react'

export const PodDepositReceipt = (props) => {
  const { quantity, prevTicketBalance, prevUnderlyingBalance, pod } = props
  const {
    address: ticketAddress,
    decimals: ticketDecimals,
    symbol: ticketSymbol
  } = pod.tokens.podStablecoin
  const { symbol: underlyingTokenSymbol } = pod.tokens.underlyingToken
  const { prizePeriodSeconds, prizePeriodStartedAt, isRngRequested } = pod.prize

  return (
    <DepositReceipt
      {...props}
      quantity={quantity}
      prevTicketBalance={prevTicketBalance}
      prevUnderlyingBalance={prevUnderlyingBalance}
      ticketAddress={ticketAddress}
      ticketDecimals={ticketDecimals}
      ticketSymbol={ticketSymbol}
      underlyingTokenSymbol={underlyingTokenSymbol}
      prizePeriodSeconds={prizePeriodSeconds}
      prizePeriodStartedAt={prizePeriodStartedAt}
      isRngRequested={isRngRequested}
    />
  )
}
