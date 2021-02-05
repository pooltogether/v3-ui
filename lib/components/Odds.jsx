import React from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { calculateOdds } from 'lib/utils/calculateOdds'

export function Odds(props) {
  const { t } = useTranslation()

  const {
    asSpan,
    className,
    hide,
    fontSansRegular,
    pool,
    showLabel,
    sayEveryWeek,
    splitLines,
    altSplitLines,
    style,
    timeTravelTicketSupply,
    usersBalance,
  } = props

  let { additionalAmount } = props

  const font = fontSansRegular ? 'font-sans' : ''

  let content = null

  const hasBalance = !isNaN(usersBalance) && usersBalance > 0

  const underlyingCollateralDecimals = pool?.underlyingCollateralDecimals
  const ticketSupply = timeTravelTicketSupply || pool?.ticketSupply
  const numberOfWinners = pool?.numberOfWinners ? parseInt(pool?.numberOfWinners, 10) : 1

  const usersBalanceBN = usersBalance
    ? ethers.utils.bigNumberify(usersBalance)
    : ethers.utils.bigNumberify(0)
  const ticketSupplyBN = ticketSupply
    ? ethers.utils.bigNumberify(ticketSupply)
    : ethers.utils.bigNumberify(0)

  const additionalAmountBN = additionalAmount
    ? ethers.utils.parseUnits(additionalAmount, underlyingCollateralDecimals)
    : ethers.utils.bigNumberify(0)

  const ticketSupplyWithDepositAmountBN = ticketSupplyBN
    ? ticketSupplyBN.add(additionalAmountBN)
    : ethers.utils.bigNumberify(0)

  const result = calculateOdds(
    usersBalanceBN.add(additionalAmountBN),
    ticketSupplyWithDepositAmountBN,
    underlyingCollateralDecimals,
    numberOfWinners
  )

  let label = showLabel && (
    <>
      {additionalAmountBN.gt(0) ? (
        <>
          <span className='font-bold text-flashy'>{t('newOddsOfWinning')}</span>
        </>
      ) : (
        t('currentOddsOfWinning')
      )}
    </>
  )

  if (result === 0) {
    label = (
      <>
        {label}
        <br />
        {t('notAvailableAbbreviation')}
      </>
    )
  } else if (!hide && Boolean(result) && (hasBalance || additionalAmountBN.gt(0))) {
    const totalOdds = <PoolCountUp fontSansRegular start={result} end={result} />

    content = (
      <>
        {label} {splitLines && <br />}
        <span className={`${font} font-bold`}>1</span>
        {altSplitLines ? (
          <>
            <div className='inline-block xs:block ml-1 xs:ml-0 -mt-1 text-xs sm:text-sm'>
              {t('in')} {totalOdds}
            </div>
          </>
        ) : (
          <>
            &nbsp;{t('in')} {totalOdds}
          </>
        )}{' '}
        {sayEveryWeek && t('everyWeek')}
      </>
    )
  }

  if (asSpan) {
    return (
      <span className={className} style={style}>
        {content}
      </span>
    )
  } else {
    return (
      <div
        style={{
          minHeight: 24,
        }}
        className={className}
        style={style}
      >
        {content}
      </div>
    )
  }
}
