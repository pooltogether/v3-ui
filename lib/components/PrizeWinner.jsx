import React, { useContext } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { useTranslation, Trans } from 'lib/../i18n'
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
  const { t } = useTranslation()

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

    <span className='block xs:inline-block'>
      {t('odds')}: <Odds
        fontSansRegular
        className='font-bold text-flashy'
        pool={pool}
        usersBalance={usersTicketBalance}
      />
    </span>

    <span
      className='ml-0 sm:ml-4 mr-4'
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
    </span>
  </>
}
