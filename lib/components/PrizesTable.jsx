import React, { useMemo } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'
import { fromUnixTime } from 'date-fns'
import { useTable } from 'react-table'

import { poolFormat } from 'lib/date-fns-factory'
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

const extractPrizeId = (prize) => {
  return parseInt(prize.id.split('-')[1], 10)
}

const prizeLink = (pool, prize) => {
  return <Link
    href='/prizes/[symbol]/[prizeId]'
    as={`/prizes/${pool.symbol}/${prize.id}`}
  >
    <a>
      view details
    </a>
  </Link>
}

const formatPrizeObject = (pool, prize) => {
  const decimals = pool.underlyingCollateralDecimals
  const prizeAmount = prize.prize && decimals ?
    ethers.utils.formatUnits(
      prize.prize,
      Number(decimals)
    ) : ethers.utils.bigNumberify(0)

  let prizeStatus = '...'
  prizeStatus = prize.winners && prize.winners.length > 0 ?
    prize.winners.map(winner => winner.id) :
    'No winner'

  return {
    startedAt: formatDate(prize?.prizePeriodStartedAt),
    awardedAt: formatDate(prize?.awardedTimestamp),
    prizeAmount: `$${prizeAmount.toString()}`,
    status: prizeStatus,
    view: prizeLink(pool, { id: extractPrizeId(prize) })
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
    const lastPrize = prizes[0]
    const currentPrizeId = extractPrizeId(lastPrize) + 1

    console.log({ ep: pool?.estimatePrize?.toString()})
    const currentPrize = {
      prizeAmount: `$${displayAmountInEther(
        pool.estimatePrize,
        { decimals }
      )}`,
      status: 'Current prize',
      view: prizeLink(pool, { id: currentPrizeId })
    }

    const prizeObjects = prizes.map(prize => formatPrizeObject(pool, prize))

    return [
      currentPrize,
      ...prizeObjects
    ]
  }, [prizes])
  
  const tableInstance = useTable({
    columns,
    data
  })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance


  return <>
    <table
      {...getTableProps()}
    >
      <thead>
        {
          headerGroups.map(headerGroup => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
            >
              {
                headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                  >
                    {column.render('Header')}
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>
      <tbody
        {...getTableBodyProps()}
      >
        {
          rows.map(row => {
            prepareRow(row)

            return <>
              <tr {...row.getRowProps()}>
                {
                  row.cells.map(cell => {
                    return (
                      <td
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  })
                }
              </tr>
            </>
          })}
      </tbody>
    </table>

  </>
}
