import React, { useMemo } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'
import { fromUnixTime } from 'date-fns'
import { useTable } from 'react-table'

import { poolFormat } from 'lib/date-fns-factory'
import { BasicTable } from 'lib/components/BasicTable'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

const currentLang = 'en'

const formatDate = (date) => {
  if (!date) { return }
  return poolFormat(
    fromUnixTime(date),
    currentLang,
    'MMMM do, yyyy @ HH:mm'
  )
}

const extractPrizeNumber = (prize) => {
  return parseInt(prize.id.split('-')[1], 10)
}

const prizeLink = (pool, prize) => {
  return <Link
    href='/prizes/[symbol]/[prizeNumber]'
    as={`/prizes/${pool.symbol}/${prize.id}`}
    shallow
  >
    <a
      className='text-secondary hover:text-blue trans'
    >
      view details
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

const prizeStatusString = (prize) => {
  const state = prizeState(prize)

  if (state === AWARDED) {
    return prize.winners && prize.winners.length > 0 ?
      prize.winners.map(winner => winner.id) :
      'No winner'
  } else if (state === AWARD_STARTED) {
    return 'Awarding...'
  } else {
    return '...'
  }
}

const formatPrizeObject = (pool, prize) => {
  const decimals = pool.underlyingCollateralDecimals
  const prizeAmount = prize.net && decimals ?
    displayAmountInEther(
      prize.net,
      { decimals } 
    ) : ethers.utils.bigNumberify(0)

  return {
    startedAt: formatDate(prize?.prizePeriodStartedTimestamp),
    awardedAt: formatDate(prize?.awardedTimestamp),
    prizeAmount: `$${prizeAmount.toString()} ${pool?.underlyingCollateralSymbol}`,
    status: prizeStatusString(prize),
    view: prizeLink(pool, { id: extractPrizeNumber(prize) })
  }
}

export const PrizesTable = (
  props,
) => {
  const { pool, prizes } = props

  const decimals = pool?.underlyingCollateralDecimals
  
  if (!prizes || prizes?.length === 0) {
    return null
  }

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'Prize amount',
        accessor: 'prizeAmount', // accessor is the "key" in the data
      },
      {
        Header: 'Awarded on',
        accessor: 'awardedAt',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: '',
        accessor: 'view',
      },
    ]
  }, [] )

  const data = React.useMemo(() => {
    const prizeRows = prizes.map(prize => formatPrizeObject(pool, prize))

    const lastPrize = prizes[0]

    let currentPrize
    // If we have a prize amount then we know the last prize has been rewarded
    if (lastPrize.awardedBlock) {
      const currentPrizeId = extractPrizeNumber(lastPrize) + 1
      const amount = displayAmountInEther(
        pool.estimatePrize,
        { decimals }
      )

      currentPrize = {
        prizeAmount: `$${amount} ${pool.underlyingCollateralSymbol}`,
        status: 'Current',
        view: prizeLink(pool, { id: currentPrizeId })
      }

      prizeRows.unshift(currentPrize)
    }

    return prizeRows
  }, [prizes])
  
  const tableInstance = useTable({
    columns,
    data
  })

  return <BasicTable
    tableInstance={tableInstance}
  />

}
