import React from 'react'
import { ethers } from 'ethers'
import classnames from 'classnames'

import { useTranslation } from 'lib/../i18n'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { calculateOdds } from 'lib/utils/calculateOdds'
import { getMinPrecision, getPrecision } from 'lib/utils/numberWithCommas'

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
    textFlashy
  } = props

  let { additionalAmount } = props

  const font = fontSansRegular ? 'font-sans' : ''

  let content = null

  const hasBalance = !isNaN(usersBalance) && usersBalance > 0

  const underlyingCollateralDecimals = pool?.underlyingCollateralDecimals
  const ticketSupply = timeTravelTicketSupply || pool?.ticketSupply
  const numberOfWinners = pool?.numberOfWinners ? parseInt(pool?.numberOfWinners, 10) : 1

  const usersBalanceBN = usersBalance
    ? ethers.BigNumber.from(usersBalance)
    : ethers.BigNumber.from(0)
  const ticketSupplyBN = ticketSupply
    ? ethers.BigNumber.from(ticketSupply)
    : ethers.BigNumber.from(0)

  const additionalAmountBN = additionalAmount
    ? ethers.utils.parseUnits(additionalAmount, underlyingCollateralDecimals)
    : ethers.BigNumber.from(0)

  const ticketSupplyWithDepositAmountBN = ticketSupplyBN
    ? ticketSupplyBN.add(additionalAmountBN)
    : ethers.BigNumber.from(0)

  const result = calculateOdds(
    usersBalanceBN.add(additionalAmountBN),
    ticketSupplyWithDepositAmountBN,
    underlyingCollateralDecimals,
    numberOfWinners
  )

  let label = showLabel && (
    <>
      {additionalAmountBN.gt(0) ? (
        <span className='text-accent-1'>{t('newOddsOfWinning')}</span>
      ) : (
        <span className='text-accent-1'>{t('currentOddsOfWinning')}</span>
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
    const totalOdds = (
      <PoolCountUp
        decimals={getMinPrecision(result, { additionalDigits: getPrecision(result) })}
        fontSansRegular
        start={result}
        end={result}
      />
    )

    content = (
      <>
        {label} {splitLines && <br />}
        <span
          className={classnames(`${font} mt-1 font-bold`, {
            'text-flashy': textFlashy
          })}
        >
          1
        </span>
        {altSplitLines ? (
          <>
            <div
              className={classnames('inline-block xs:block ml-1 xs:ml-0 -mt-1 text-xs sm:text-sm', {
                'text-flashy': textFlashy
              })}
            >
              {t('in')} {totalOdds}
            </div>
          </>
        ) : (
          <span className={classnames({ 'text-flashy': textFlashy })}>
            &nbsp;{t('in')} {totalOdds}
          </span>
        )}{' '}
        <span className={classnames({ 'text-flashy': textFlashy })}>
          {sayEveryWeek && t('everyWeek')}
        </span>
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
          minHeight: 24
        }}
        className={className}
        style={style}
      >
        {content}
      </div>
    )
  }
}

Odds.defaultProps = {
  textFlashy: true
}
