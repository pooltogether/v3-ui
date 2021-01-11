import React from 'react'
import Link from 'next/link'
import BeatLoader from 'react-spinners/BeatLoader'
import { useTable } from 'react-table'

import { useTranslation } from 'lib/../i18n'
import { BasicTable } from 'lib/components/BasicTable'
import { TimeTravelPool } from 'lib/components/TimeTravelPool'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'
import { formatDate } from 'lib/utils/formatDate'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

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

// const prizeState = (prize) => {
//   if (prize.amount) {
//     return AWARDED
//   } else if (prize.amount === null) {
//     return AWARD_STARTED
//   } else {
//     return UNAWARDED
//   }
// }

const formatPrizeObject = (t, pool, prize, querySymbol) => {
  const id = extractPrizeNumberFromPrize(prize)
  // const decimals = pool.underlyingCollateralDecimals
  // const prizeAmount = prize.amount && decimals ?
  //   displayAmountInEther(
  //     prize.amount,
  //     { decimals, precision: 2 }
  //   ) : ethers.utils.bigNumberify(0)

  return {
    prizeNumber: id,
    startedAt: formatDate(prize?.prizePeriodStartedTimestamp),
    // winner: shorten(prize?.winners?.[0]),
    awardedAt: <>
      <span className='block'>
        {formatDate(prize?.awardedTimestamp)}
      </span>
    </>,
    prizeAmount: <>
      <TimeTravelPool
        blockNumber={parseInt(prize?.awardedBlock, 10)}
        poolAddress={pool?.id}
        querySymbol={querySymbol}
        prize={prize}
      >
        {({ timeTravelPool }) => {
          return <>
            {timeTravelPool?.fetchingTotals ? <BeatLoader
              size={3}
              color='rgba(255,255,255,0.3)'
            /> :
              `$${numberWithCommas(timeTravelPool?.totalPrizeAmountUSD)}`
            }
          </>
        }}
      </TimeTravelPool>
    </>,
    view: prizeLink(t, pool, { id })
  }
}

export const PrizesTable = (
  props,
) => {
  const { t } = useTranslation()
  const { pool, prizes, querySymbol } = props

  const decimals = pool?.underlyingCollateralDecimals

  const columns = React.useMemo(() => {
    return [
      {
        Header: '#',
        accessor: 'prizeNumber',
      },
      {
        Header: t('prize'),
        accessor: 'prizeAmount', // accessor is the "key" in the data
      },
      // {
      //   Header: row => <div
      //     className='hidden sm:block'
      //   >
      //     {t('winner')}
      //   </div>,
      //   accessor: 'winner',
      //   Cell: row => <div
      //     className='hidden sm:block'
      //   >{row.value}</div>
      // },
      {
        Header: t('awardedOn'),
        accessor: 'awardedAt',
      },
      {
        Header: '',
        accessor: 'view',
        Cell: row => <div style={{ textAlign: 'right' }}>{row.value}</div>
      },
    ]
  }, [] )

  const data = React.useMemo(() => {
    const prizeRows = prizes.map(prize => formatPrizeObject(t, pool, prize, querySymbol))

    const lastPrize = prizes[0]

    let currentPrize
    
    // If we have a prize amount then we know the last prize has been rewarded
    if (lastPrize.awardedBlock) {
      const amount = pool?.totalPrizeAmountUSD

      currentPrize = {
        prizeAmount: <><span className='text-flashy'>${numberWithCommas(amount, { precision: 2 })}</span></>,
        awardedAt: <><span className='text-flashy'>{t('current')}</span></>,
        view: <Link
          href='/pools/[symbol]'
          as={`/pools/${querySymbol}`}
          shallow
        >
          <a
            className='trans text-right w-full'
          >
            {t('viewDetails')}
          </a>
        </Link>
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
