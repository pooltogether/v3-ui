import React from 'react'
import { ethers } from 'ethers'
import { useTranslation, Trans } from 'react-i18next'

import { PoolNumber } from 'lib/components/PoolNumber'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { calculateOdds } from 'lib/utils/calculateOdds'

export function WithdrawOdds(props) {
  const { t } = useTranslation()

  const { pool, usersTicketBalanceUnformatted } = props

  if (!pool || !usersTicketBalanceUnformatted) {
    return null
  }

  const decimals = pool.tokens.underlyingToken.decimals
  const numberOfWinners = pool.config.numberOfWinners

  const withdrawAmountBN = props.withdrawAmount
    ? ethers.utils.parseUnits(props.withdrawAmount.toString(), decimals)
    : ethers.BigNumber.from(0)

  const overBalance = withdrawAmountBN.gt(usersTicketBalanceUnformatted)

  const ticketTotalSupply = ethers.BigNumber.from(pool.tokens.ticket.totalSupplyUnformatted)

  const totalSupplyLessWithdrawAmountBN = ticketTotalSupply
    ? ticketTotalSupply.sub(withdrawAmountBN)
    : ethers.BigNumber.from(0)

  const currentOdds = calculateOdds(
    usersTicketBalanceUnformatted,
    ticketTotalSupply,
    decimals,
    numberOfWinners
  )

  const newOdds = calculateOdds(
    usersTicketBalanceUnformatted.sub(withdrawAmountBN),
    totalSupplyLessWithdrawAmountBN,
    decimals,
    numberOfWinners
  )

  return (
    <>
      <div
        style={{
          minHeight: 24
        }}
      >
        {!props.withdrawAmount && (
          <>
            <strong>{t('currentOddsOfWinning')}</strong> 1 {t('in')}{' '}
            {numberWithCommas(currentOdds, { precision: 2 })}
          </>
        )}

        {props.withdrawAmount && !overBalance && (
          <span className='text-xs sm:text-sm text-orange-500 ml-0 sm:ml-4 opacity-50'>
            {newOdds ? (
              <Trans
                i18nKey='yourOddsWillReduceTo'
                defaults='Your odds will be reduced from 1 in {{currentOdds}} to 1 in {{newOdds}}'
                components={{
                  bold: <span className='font-bold' />,
                  number: <PoolNumber />,
                  lineBreak: <div />
                }}
                values={{
                  currentOdds: numberWithCommas(currentOdds, { precision: 2 }),
                  newOdds: numberWithCommas(newOdds, { precision: 2 })
                }}
              />
            ) : (
              <strong>{t('withdrawingEverythingMakeYouIneligible')}</strong>
            )}
          </span>
        )}
      </div>
    </>
  )
}
