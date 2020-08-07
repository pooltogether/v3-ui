import React from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'
import { useTable } from 'react-table'

import { BasicTable } from 'lib/components/BasicTable'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { shorten } from 'lib/utils/shorten'

const playerLink = (player) => {
  return <Link
    href='/players/[playerAddress]'
    as={`/players/${player.address}`}
    shallow
  >
    <a
      className='text-secondary hover:text-blue trans'
    >
      view player info
    </a>
  </Link>
}

const formatPlayerObject = (pool, player) => {
  const decimals = pool.underlyingCollateralDecimals
  const balance = player.balance && decimals ?
    ethers.utils.formatUnits(
      player.balance,
      Number(decimals)
    ) : ethers.utils.bigNumberify(0)

  
  return {
    balance: `${numberWithCommas(
      balance.toString(),
      { precision: 0 }
    )}`,
    address: shorten(player.address),
    odds: '1 in 2',
    view: playerLink(player)
  }
}

export const PlayersTable = (
  props,
) => {
  const { pool, players } = props

  const decimals = pool?.underlyingCollateralDecimals
  
  if (!players || players?.length === 0) {
    return null
  }

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'Tickets',
        accessor: 'balance', // accessor is the "key" in the data
      },
      {
        Header: 'Odds',
        accessor: 'odds',
      },
      {
        Header: '',
        accessor: 'view',
      },
    ]
  }, [] )

  const data = React.useMemo(() => {
    return players.map(player => formatPlayerObject(pool, player))
  }, [players])
  
  const tableInstance = useTable({
    columns,
    data
  })

  return <BasicTable
    tableInstance={tableInstance}
  />

}
