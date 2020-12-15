import React from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { Odds } from 'lib/components/Odds'
import { PoolNumber } from 'lib/components/PoolNumber'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { usePrizePoolAccountQuery } from 'lib/hooks/usePrizePoolAccountQuery'
import { getPrizePoolAccountControlledTokenBalance } from 'lib/utils/getPrizePoolAccountControlledTokenBalance'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { shorten } from 'lib/utils/shorten'

export const PrizeWinner = (
  props,
) => {
  const { t } = useTranslation()

  const { grandPrizeWinner, pool, prize, winnersAddress } = props

  const blockNumber = prize?.awardedBlock


  let playerAddressError
  if (winnersAddress) {
    try {
      ethers.utils.getAddress(winnersAddress)
    } catch (e) {
      console.error(e)

      if (e.message.match('invalid address')) {
        playerAddressError = true
      }
    }
  }

  const { data, error } = usePrizePoolAccountQuery(
    pool,
    winnersAddress,
    blockNumber,
    playerAddressError
  )

  const prizePoolAccount = data

  const decimals = pool?.underlyingCollateralDecimals || 18
  let usersTicketBalance = 0

  const controlledTicketTokenBalance = getPrizePoolAccountControlledTokenBalance(prizePoolAccount, pool?.ticketToken?.id)

  if (controlledTicketTokenBalance) {
    usersTicketBalance = Number(ethers.utils.formatUnits(
      controlledTicketTokenBalance.balance,
      Number(decimals)
    ))
  }

  
  if (error) {
    console.error(error)
  }

  if (!prizePoolAccount) {
    return <tr>
      <td>
        <V3LoadingDots />
      </td>
    </tr>
  }

  return <>
    <tr>
      <td>
        {grandPrizeWinner ? t('grandPrize') : t('runnerUp')}
      </td>

      <td>
        <Link
          href='/players/[playerAddress]'
          as={`/players/${winnersAddress}`}
        >
          <a
            className='text-accent-1'
          >
            {shorten(winnersAddress)}
          </a>
        </Link>
      </td>

      <td>
        <span className='block xs:inline-block'>
          <Odds
            fontSansRegular
            className='font-bold text-flashy'
            pool={pool}
            usersBalance={usersTicketBalance}
          />
        </span>
      </td>

      <td
        width='70'
      >
        <PoolNumber>
          {numberWithCommas(usersTicketBalance, {precision: 0 })}
        </PoolNumber>
      </td>
    </tr>
  </>
}
