import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { TransactionsListItem } from 'lib/components/TransactionsListItem'
import { transactionsVar } from 'lib/apollo/cache'
import { clearPreviousTransactionsFactory } from 'lib/apollo/clearPreviousTransactionsFactory'
import { transactionsQuery } from 'lib/queries/transactionQueries'

export const TransactionsList = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { chainId, usersAddress } = authControllerContext

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions

  const notCancelledTransactions = transactions
    .filter(t => !t.cancelled)
    .reverse()

  const pendingTransactionsCount = transactions
    .filter(t => !t.completed)
    .length
  
  const pastTransactionsCount = transactions
    .filter(t => t.completed)
    .length

  const handleClearPrevious = (e) => {
    e.preventDefault()

    if (usersAddress, chainId) {
      const clearFxn = clearPreviousTransactionsFactory(
        transactionsVar,
        usersAddress,
        chainId
      )
      clearFxn()
    }
  }

  if (!usersAddress) {
    return null
  }

  return <>
    <div
      className='px-8 sm:px-10 pt-8'
    >
      <div
        className='flex justify-between items-center text-xxs xs:text-xs uppercase font-bold text-accent-3'
      >
        Recent transactions {pastTransactionsCount > 0 && <>
          <button
            onClick={handleClearPrevious}
            className='inline-block text-xxs bg-body rounded-full border-2 border-accent-4 px-2 trans trans-fastest font-bold'
          >
            Clear history
        </button>
        </>}
      </div> 

      {pendingTransactionsCount > 0 && <>
        <div className='block sm:inline-block text-caption text-xxs'>
          {pendingTransactionsCount} pending
        </div>
      </>}

    </div>

    <div
      className='dialog-inner-content flex-grow relative flex flex-col w-full pb-2 text-xs sm:text-sm'
    >
      {notCancelledTransactions.length === 0 ? <>
        <div
          className='text-default-soft px-8 sm:px-10 pb-4 uppercase text-xs'
        >
          Currently no active transactions...
        </div>
      </> : <>
          <ul
            className='transactions-ui-list overflow-x-hidden overflow-y-auto px-8 sm:px-10 py-4'
          >
            {notCancelledTransactions.map(tx => {
              return <TransactionsListItem
                key={tx.id}
                tx={tx}
              />
            })}
          </ul>
        </>}
    </div>
          
    
  </>
}