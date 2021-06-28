import React from 'react'
import Link from 'next/link'
import { useTable } from 'react-table'
import { useTranslation } from 'react-i18next'
import { BasicTable, InternalLink } from '@pooltogether/react-components'

import { PlayerLabel } from 'lib/components/PlayerLabel'
import { PoolNumber } from 'lib/components/PoolNumber'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

const _playerLink = (t, player) => {
  return (
    <InternalLink
      Link={Link}
      href='/players/[playerAddress]'
      as={`/players/${player?.account?.id}`}
      shallow
    >
      <span className='hidden xs:block'>{t('viewPlayerInfo')}</span>
      <span className='block xs:hidden'>{t('view')}</span>
    </InternalLink>
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
        className: 'td-address pb-2'
      },
      {
        Header: t('balance'),
        accessor: 'balance',
        className: 'td-balance pb-2'
      },
      {
        Header: '',
        accessor: 'view',
        className: 'td-view pb-2',
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

  const tableInstance = useTable({
    columns,
    data
  })

  if (!players || players?.length === 0) {
    return null
  }

  return <BasicTable {...props} tableInstance={tableInstance} />
}
