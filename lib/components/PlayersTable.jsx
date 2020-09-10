import React from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'
import { useTable } from 'react-table'

import { useTranslation } from 'lib/../i18n'
import { BasicTable } from 'lib/components/BasicTable'
import { Odds } from 'lib/components/Odds'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { shorten } from 'lib/utils/shorten'

const playerLink = (t, player) => {
  return <Link
    href='/players/[playerAddress]'
    as={`/players/${player.address}`}
    shallow
  >
    <a
      className='trans'
    >
      {t('viewPlayerInfo')}
    </a>
  </Link>
}

const formatPlayerObject = (t, pool, player, timeTravelTotalSupply) => {
  const decimals = pool.underlyingCollateralDecimals
  const balance = player.balance && decimals ?
    ethers.utils.formatUnits(
      player.balance,
      Number(decimals)
    ) : ethers.utils.bigNumberify(0)

  
  return {
    balance: `${numberWithCommas(
      balance.toString(),
      { precision: 2 }
    )}`,
    address: shorten(player.address),
    odds: <Odds
      timeTravelTotalSupply={timeTravelTotalSupply}
      pool={pool}
      usersBalance={balance}
    />,
    view: playerLink(t, player)
  }
}

export const PlayersTable = (
  props,
) => {
  const { t } = useTranslation()

  let players = []
  if (props.players) {
    players = props.players
  }

  const { timeTravelTotalSupply, pool } = props

  const columns = React.useMemo(() => {
    return [
      {
        Header: t('address'),
        accessor: 'address',
      },
      {
        Header: t('tickets'),
        accessor: 'balance', // accessor is the "key" in the data
      },
      {
        Header: t('odds'),
        accessor: 'odds',
      },
      {
        Header: '',
        accessor: 'view',
        Cell: row => <div style={{ textAlign: 'right' }}>{row.value}</div>
      },
    ]
  }, [] )

  const data = React.useMemo(() => {
    return players.map(player => formatPlayerObject(
      t,
      pool,
      player,
      timeTravelTotalSupply
    ))
  }, [players, pool, timeTravelTotalSupply])
  
  const tableInstance = useTable({
    columns,
    data
  })

  if (!players || players?.length === 0) {
    return null
  }

  return <BasicTable
    tableInstance={tableInstance}
  />

}
