import React from 'react'

export const BasicTable = (props) => {
  const { nestedTable, tableInstance } = props

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance

  let className = 'table table-fixed w-full text-xxxs xs:text-xxs sm:text-sm align-top'

  return (
    <>
      <div {...getTableProps()} className={className}>
        <div className='w-full'>
          {headerGroups.map((headerGroup, index) => {
            return (
              <div
                key={`header-group-${index}`}
                {...headerGroup.getHeaderGroupProps()}
                style={nestedTable ? { background: 'none' } : {}}
                className='tr'
              >
                {headerGroup.headers.map((column) => {
                  return (
                    <div
                      key={`column-${column.id}`}
                      {...column.getHeaderProps([
                        {
                          className: `th ${column.className}`,
                          style: column.style
                        }
                      ])}
                    >
                      {column.render('Header')}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div className='w-full' {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)

            return (
              <div key={`row-${row.id}`} {...row.getRowProps()} className='tr'>
                {row.cells.map((cell, index) => {
                  return (
                    <div
                      key={`row-${row.id}-cell-${index}`}
                      className='td'
                      {...cell.getCellProps([
                        {
                          className: `td ${cell.column.className}`,
                          style: cell.column.style
                        }
                      ])}
                    >
                      {cell.render('Cell')}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
