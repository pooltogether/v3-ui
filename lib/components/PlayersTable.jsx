import React from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'
import { useTable } from 'react-table'

import { useTranslation } from 'lib/../i18n'
import { BasicTable } from 'lib/components/BasicTable'
import { Odds } from 'lib/components/Odds'
import { PoolNumber } from 'lib/components/PoolNumber'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
// import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { shorten } from 'lib/utils/shorten'

const playerLink = (t, player) => {
  return (
    <Link href='/players/[playerAddress]' as={`/players/${player?.account?.id}`} shallow>
      <a className='trans'>{t('viewPlayerInfo')}</a>
    </Link>
  )
}

const formatPlayerObject = (t, pool, player, winners) => {
  const decimals = pool.underlyingCollateralDecimals

  const playerAddress = player?.account?.id

  const isWinner = winners?.includes(playerAddress)

  const address = (
    <>
      {shorten(playerAddress)}{' '}
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
    odds: (
      <Odds timeTravelTicketSupply={pool.ticketSupply} pool={pool} usersBalance={player.balance} />
    ),
    view: playerLink(t, player)
  }
}

export const PlayersTable = (props) => {
  const { t } = useTranslation()

  let players = []
  if (props.balances) {
    players = props.balances
  }

  const { pool, prize } = props

  const columns = React.useMemo(() => {
    return [
      {
        Header: t('address'),
        accessor: 'address'
      },
      {
        Header: t('balance'),
        accessor: 'balance' // accessor is the "key" in the data
      },
      {
        Header: t('odds'),
        accessor: 'odds'
      },
      {
        Header: '',
        accessor: 'view',
        Cell: (row) => <div style={{ textAlign: 'right' }}>{row.value}</div>
      }
    ]
  }, [])

  const winners = prize?.awardedControlledTokens.map((awardedControlledToken) => {
    return awardedControlledToken.winner
  })

  let data = React.useMemo(() => {
    return players.map((player) => {
      return formatPlayerObject(t, pool, player, winners)
    })
  }, [players, pool, pool?.ticketSupply])

  const tableInstance = useTable({
    columns,
    data
  })

  if (!players || players?.length === 0) {
    return null
  }

  return <BasicTable {...props} tableInstance={tableInstance} />
}
