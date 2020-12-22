import React from 'react'

import { useTranslation, Trans } from 'lib/../i18n'
import { PoolNumber } from 'lib/components/PoolNumber'
import { formatBigNumber } from 'lib/utils/formatBigNumber'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export function WithdrawOdds(props) {
  const { t } = useTranslation()

  const {
    className,
    pool,
    style,
    usersBalance,
  } = props

  if (usersBalance === 0) {
    return null
  }

  let newOdds = null

  const quantity = Number(props.quantity) * -1

  let preTicketSupplyFloat = Number(formatBigNumber(pool?.ticketSupply, pool))
  const numberOfWinners = pool?.numberOfWinners ?
    parseInt(pool?.numberOfWinners, 10) :
    1

  const currentOdds = numberWithCommas(
    (preTicketSupplyFloat / usersBalance) / numberOfWinners
  )

  let postTicketSupplyFloat = preTicketSupplyFloat + quantity
  let postWithdrawBalance = Number(usersBalance) + quantity
  if (postWithdrawBalance < 1) {
    newOdds = 0
  } else {
    newOdds = numberWithCommas(
      (postTicketSupplyFloat / postWithdrawBalance) / numberOfWinners
    )
  }

  let content = <>
    {quantity !== 0 ? <>
      <Trans
        i18nKey='yourOddsWillReduceTo'
        defaults='Your odds will be reduced from 1 in {{currentOdds}} to 1 in {{newOdds}}'
        components={{
          number: <PoolNumber />,
        }}
        values={{
          currentOdds,
          newOdds
        }}
      />
    </> : <>
      {t('currentOddsOfWinning')} 1 {t('in')} {currentOdds}
    </>} 
  </>

  if (newOdds === 0 || !isFinite(newOdds)) {
    content = t('withdrawingEverythingMakeYouIneligible')
  }

  return <div
    style={{
      minHeight: 24
    }}
    className={className}
    style={style}
  >
    {content}
  </div>
}
