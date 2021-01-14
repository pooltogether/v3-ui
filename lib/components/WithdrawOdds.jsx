import React from 'react'
import { ethers } from 'ethers'

import { useTranslation, Trans } from 'lib/../i18n'
import { PoolNumber } from 'lib/components/PoolNumber'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { calculateOdds } from 'lib/utils/calculateOdds'

export function WithdrawOdds(props) {
  const { t } = useTranslation()

  const {
    pool,
    usersTicketBalanceBN
  } = props

  if (!pool || !pool.ticketSupply || !usersTicketBalanceBN) {
    return null
  }

  const decimals = pool.underlyingCollateralDecimals

  const withdrawAmountBN = props.withdrawAmount
    ? ethers.utils.parseUnits(props.withdrawAmount.toString(), decimals)
    : ethers.utils.bigNumberify(0)

  const overBalance = withdrawAmountBN.gt(usersTicketBalanceBN)

  const numberOfWinners = pool?.numberOfWinners ?
    parseInt(pool?.numberOfWinners, 10) :
    1

  const ticketTotalSupply = ethers.utils.bigNumberify(pool.ticketSupply)
  
  const totalSupplyLessWithdrawAmountBN = ticketTotalSupply ?
    ticketTotalSupply.sub(withdrawAmountBN) :
    ethers.utils.bigNumberify(0)

  const currentOdds = calculateOdds(
    usersTicketBalanceBN,
    ticketTotalSupply,
    decimals,
    numberOfWinners
  )

  const newOdds = calculateOdds(
    usersTicketBalanceBN.sub(withdrawAmountBN),
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
        {!props.withdrawAmount && (<>
          <strong>{t('currentOddsOfWinning')}</strong> 1 {t('in')} {numberWithCommas(currentOdds, {precision: 2 })}
        </>)}

        {props.withdrawAmount && !overBalance && (
          <span className='text-xs sm:text-sm text-orange-500 ml-0 sm:ml-4'>
            {newOdds ? (
              <Trans
                i18nKey='yourOddsWillReduceTo'
                defaults='Your odds will be reduced from 1 in {{currentOdds}} to 1 in {{newOdds}}'
                components={{
                  bold: <strong />,
                  number: <PoolNumber />,
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
