import { numberWithCommas } from '@pooltogether/utilities'
import { DepositReceipt } from 'lib/components/DepositWizard/DepositReceipt'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatUnits, parseUnits } from '@ethersproject/units'

export const PoolDepositReceipt = (props) => {
  const { quantity, prevTicketBalance, prevUnderlyingBalance, pool } = props
  const {
    address: ticketAddress,
    decimals: ticketDecimals,
    symbol: ticketSymbol
  } = pool.tokens.ticket
  const { symbol: underlyingTokenSymbol } = pool.tokens.underlyingToken
  const { prizePeriodSeconds, prizePeriodStartedAt, isRngRequested } = pool.prize

  const { t } = useTranslation()

  const balance = formatUnits(
    parseUnits(quantity, ticketDecimals).add(parseUnits(prevTicketBalance, ticketDecimals)),
    ticketDecimals
  )

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
      message={t('youNowHaveAmountTicketsInTheTickerPool', {
        amount: numberWithCommas(balance),
        ticker: underlyingTokenSymbol
      })}
    />
  )
}
