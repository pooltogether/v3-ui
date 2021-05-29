import React from 'react'
import Link from 'next/link'
import { useTable, useBlockLayout } from 'react-table'

import { useTranslation } from 'react-i18next'
import { BasicTable } from 'lib/components/BasicTable'
import { PlayerLabel } from 'lib/components/PlayerLabel'
import { PoolNumber } from 'lib/components/PoolNumber'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

const _playerLink = (t, player) => {
  return (
    <Link href='/players/[playerAddress]' as={`/players/${player?.account?.id}`} shallow>
      <a className='trans text-accent-1 underline'>{t('viewPlayerInfo')}</a>
    </Link>
  )
}

const formatPlayerObject = (t, pool, player, winners) => {
  const decimals = pool.tokens.underlyingToken.decimals

  const playerAddress = player?.account?.id?.toLowerCase()

  const isWinner = winners?.includes(playerAddress)

  const address = (
    <>
      <PlayerLabel
        id={`tooltip-playerLabel-${playerAddress}-playersTable`}
        playerAddress={playerAddress}
      />
      {isWinner && <span className='text-flashy font-bold'>{t('winner')}</span>}
    </>
  )

  return {
    balance: player.balance ? (
      <PoolNumber>{displayAmountInEther(player.balance, { decimals, precision: 2 })}</PoolNumber>
    ) : (
      ''
    ),
    address,
    view: _playerLink(t, player)
  }
}

export const PlayersTable = (props) => {
  const { t } = useTranslation()

  let players = []
  if (props.balances) {
    players = props.balances
  }

  const { pool, prize } = props

  const columns = React.useMemo(
    () => [
      {
        Header: t('address'),
        accessor: 'address',
        className: 'td-address'
      },
      {
        Header: t('balance'),
        accessor: 'balance',
        className: 'td-balance'
      },
      {
        Header: '',
        accessor: 'view',
        className: 'td-view',
        Cell: (row) => <div style={{ textAlign: 'right' }}>{row.value}</div>
      }
    ],
    []
  )

  const winners = prize?.awardedControlledTokens.map((awardedControlledToken) => {
    return awardedControlledToken.winner
  })

  let data = React.useMemo(() => {
    return players.map((player) => {
      return formatPlayerObject(t, pool, player, winners)
    })
  }, [players, pool, pool.tokens.ticket.totalSupply])

  const tableInstance = useTable(
    {
      columns,
      data
    },
    useBlockLayout
  )

  if (!players || players?.length === 0) {
    return null
  }

  return <BasicTable {...props} tableInstance={tableInstance} />
}
