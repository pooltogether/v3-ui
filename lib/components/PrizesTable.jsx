import React, { useMemo } from 'react'
import { fromUnixTime } from 'date-fns'
import { useTable } from 'react-table'

import { poolFormat } from 'lib/date-fns-factory'

export const PrizesTable = (
  props,
) => {
  const { prizes } = props

  if (!prizes || prizes?.length === 0) {
    return null
  }

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'Prize amount',
        accessor: 'prize', // accessor is the "key" in the data
      },
      {
        Header: 'Awarded on',
        accessor: 'awardedTimestamp',
      },
    ]
  }, [] )

  const data = React.useMemo(() => {
    return prizes
  }, [prizes])
  
  const tableInstance = useTable({
    columns,
    data
    // data: prizes || []
  })


  const currentLang = 'en'

  const formatDate = (date) => {
    if (!date) { return }
    return poolFormat(
      fromUnixTime(date),
      currentLang,
      'MMMM do, yyyy @ HH:mm'
    )
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance


  return <>
    <table {...getTableProps()}>
      <thead>
        {// Loop over the header rows
          headerGroups.map(headerGroup => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {// Loop over the headers in each row
                headerGroup.headers.map(column => (
                  // Apply the header cell props
                  <th {...column.getHeaderProps()}>
                    {// Render the header
                      column.render('Header')}
                  </th>
                ))}
            </tr>
          ))}
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
        {// Loop over the table rows
          rows.map(row => {
            // Prepare the row for display
            prepareRow(row)
            return (
              // Apply the row props
              <tr {...row.getRowProps()}>
                {// Loop over the rows cells
                  row.cells.map(cell => {
                    // Apply the cell props
                    return (
                      <td {...cell.getCellProps()}>
                        {// Render the cell contents
                          cell.render('Cell')}
                      </td>
                    )
                  })}
              </tr>
            )
          })}
      </tbody>
    </table>

      {/* {reversedPrizes?.map(prize => {
        console.log(prize)
        const decimals = pool.underlyingCollateralDecimals
        const prizeAmount = prize.prize && decimals ?
          ethers.utils.formatUnits(
            prize.prize,
            Number(decimals)
          ) : ethers.utils.bigNumberify(0)

        return <div
          key={`prize-strategy-prize-${prize.id}`}
          className='mb-6'
        >


          <div>
            ID: {prize.id.split('-')[1]}
          </div>
          <div>
            Started at: {formatDate(prize?.prizePeriodStartedAt)}
            {format(fromUnixTime(prize.prizePeriodStartedTimestamp, 'MM/dd/yyyy'))}
          </div>


          <div>
            <span className='font-bold'>Awarded at:</span> {formatDate(prize?.awardedTimestamp)}
          </div>
          <div>
            <span className='font-bold'>Amount:</span> {prizeAmount.toString()}
          </div>
          <div>
            <span className='font-bold'>Winner:</span> {prize.winners.length === 0 ?
              'No winner' :
              prize.winners.map(winner => winner.id)
            }
          </div>
        </div>
      })} */}

  </>
}
