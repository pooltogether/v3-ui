import React from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'
import { useTable } from 'react-table'

import { useTranslation } from 'lib/../i18n'
import { BasicTable } from 'lib/components/BasicTable'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'
import { formatDate } from 'lib/utils/formatDate'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { shorten } from 'lib/utils/shorten'

const prizeLink = (t, pool, prize) => {
  return <Link 
    href='/prizes/[symbol]/[prizeNumber]'
    as={`/prizes/${pool.symbol}/${prize.id}`}
    shallow
  >
    <a
      className='trans text-right w-full'
    >
      {t('viewDetails')}
    </a>
  </Link>
}

const AWARDED = 'Awarded'
const AWARD_STARTED = 'AwardStarted'
const UNAWARDED = 'Unawarded'

const prizeState = (prize) => {
  if (prize.net) {
    return AWARDED
  } else if (prize.net === null) {
    return AWARD_STARTED
  } else {
    return UNAWARDED
  }
}

const prizeStatusString = (t, prize) => {
  const state = prizeState(prize)

  if (state === AWARDED) {
    return prize.winners && prize.winners.length > 0 ?
      prize.winners.map(winner => winner.id) :
      t('noWinner')
  } else if (state === AWARD_STARTED) {
    return t('awarding')
  } else {
    return '...'
  }
}

const formatPrizeObject = (t, pool, prize) => {
  const id = extractPrizeNumberFromPrize(prize)
  const decimals = pool.underlyingCollateralDecimals
  const prizeAmount = prize.net && decimals ?
    displayAmountInEther(
      prize.net,
      { decimals, precision: 2 }
    ) : ethers.utils.bigNumberify(0)

  return {
    prizeNumber: id,
    startedAt: formatDate(prize?.prizePeriodStartedTimestamp),
    winner: shorten(prize?.winners?.[0]),
    awardedAt: <>
      <span className='sm:hidden'>
        {formatDate(prize?.awardedTimestamp, { short: true })}
      </span>
      <span className='hidden sm:block'>
        {formatDate(prize?.awardedTimestamp)}
      </span>
    </>,
    prizeAmount: `$${prizeAmount.toString()} ${pool?.underlyingCollateralSymbol}`,
    status: prizeStatusString(t, prize),
    view: prizeLink(t, pool, { id })
  }
}

export const PrizesTable = (
  props,
) => {
  const { t } = useTranslation()
  const { pool, prizes } = props

  const decimals = pool?.underlyingCollateralDecimals
  
  if (!prizes || prizes?.length === 0) {
    return null
  }

  const columns = React.useMemo(() => {
    return [
      {
        Header: '#',
        accessor: 'prizeNumber',
      },
      {
        Header: t('prizeAmount'),
        accessor: 'prizeAmount', // accessor is the "key" in the data
      },
      {
        Header: row => <div
          className='hidden sm:block'
        >
          {t('winner')}
        </div>,
        accessor: 'winner',
        Cell: row => <div
          className='hidden sm:block'
        >{row.value}</div>
      },
      {
        Header: t('awardedOn'),
        accessor: 'awardedAt',
      },
      {
        Header: t('status'),
        accessor: 'status',
      },
      {
        Header: '',
        accessor: 'view',
        Cell: row => <div style={{ textAlign: 'right' }}>{row.value}</div>
      },
    ]
  }, [] )

  const data = React.useMemo(() => {
    const prizeRows = prizes.map(prize => formatPrizeObject(t, pool, prize))

    const lastPrize = prizes[0]

    let currentPrize
    
    // If we have a prize amount then we know the last prize has been rewarded
    if (lastPrize.awardedBlock) {
      const currentPrizeId = extractPrizeNumberFromPrize(lastPrize) + 1
      const amount = numberWithCommas(
        pool.estimatePrize * 1000,
        { precision: 2 }
      )

      currentPrize = {
        prizeAmount: `$${amount} ${pool.underlyingCollateralSymbol}`,
        status: t('current'),
        view: prizeLink(t, pool, { id: currentPrizeId })
      }

      prizeRows.unshift(currentPrize)
    }

    return prizeRows
  }, [pool, prizes])
  
  const tableInstance = useTable({
    columns,
    data
  })

  return <BasicTable
    tableInstance={tableInstance}
  />

}
