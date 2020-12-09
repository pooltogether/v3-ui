import React, { useContext } from 'react'
import Link from 'next/link'

import { useTranslation, Trans } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Odds } from 'lib/components/Odds'
import { PoolNumber } from 'lib/components/PoolNumber'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { shorten } from 'lib/utils/shorten'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { usePrizePoolAccountQuery } from 'lib/hooks/usePrizePoolAccountQuery'

export const PrizeWinner = (
  props,
) => {
  const { t } = useTranslation()

  const { grandPrizeWinner, pool, prize, winnersAddress } = props

  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const blockNumber = prize?.awardedBlock - 1


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

  const { status, data, error, isFetching } = usePrizePoolAccountQuery(
    pauseQueries,
    chainId,
    pool,
    winnersAddress,
    blockNumber,
    playerAddressError
  )

  const playerData = data

  const decimals = pool?.underlyingCollateralDecimals || 18
  let usersTicketBalance = 0
  if (pool && playerData && decimals) {
    usersTicketBalance = Number(ethers.utils.formatUnits(
      playerData.balance,
      Number(decimals)
    ))
  }

  
  if (error) {
    console.error(error)
  }

  if (!playerData) {
    return <V3LoadingDots />
  }

  return <>
    <tr>
      <td>
        {grandPrizeWinner && <span
          className={``}
          role='img'
          aria-label='crown emoji'
        >👑</span>}
      </td>

      <td>
        <Link
          href='/players/[playerAddress]'
          as={`/players/${winnersAddress}`}
        >
          <a
            className='font-bold'
          >
            <span className='inline-block lg:hidden'>
              {shorten(winnersAddress)}
            </span>
            <span className='hidden lg:inline-block'>
              {winnersAddress}
            </span>
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

      <td>
        <PoolNumber>
          {numberWithCommas(usersTicketBalance, {precision: 0 })}
        </PoolNumber>
      </td>
    </tr>
  </>
}
