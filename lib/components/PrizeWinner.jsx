import React, { useContext } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { Trans } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Odds } from 'lib/components/Odds'
import { PoolNumber } from 'lib/components/PoolNumber'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { timeTravelPlayerQuery } from 'lib/queries/timeTravelPlayerQuery'
import { shorten } from 'lib/utils/shorten'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const PrizeWinner = (
  props,
) => {
  const router = useRouter()

  const { prize, winnersAddress } = props

  const { pool } = useContext(PoolDataContext)

  const decimals = pool?.underlyingCollateralDecimals || 18

  const variables = { playerAddress: winnersAddress }

  const query = timeTravelPlayerQuery(prize?.awardedBlock - 1)

  const { loading, error, data } = useQuery(query, {
    variables
  })

  const playerData = data?.player?.[0]

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

  if (loading || !playerData) {
    return <V3LoadingDots />
  }

  return <>
    <Link
      href='/players/[playerAddress]'
      as={`/players/${winnersAddress}`}
    >
      <a
        className='block font-bold text-sm xs:text-base sm:text-lg text-green hover:text-white'
      >
        <div className='block lg:hidden'>
          {shorten(winnersAddress)}
        </div>
        <div className='hidden lg:block'>
          {winnersAddress}
        </div>
      </a>
    </Link>

    <div
      className='font-bold'
    >
      <Trans
        i18nKey='amountTickets'
        defaults='<number>{{amount}}</number> {{tickets}}'
        components={{
          number: <PoolNumber />,
        }}
        values={{
          amount: numberWithCommas(usersTicketBalance, { precision: 0 })
        }}
      />
    </div>

    <Odds
      fontSansRegular
      className='font-bold text-flashy'
      pool={pool}
      usersBalance={usersTicketBalance}
    />
  </>
}
