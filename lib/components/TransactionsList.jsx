import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { TransactionStatusChecker } from 'lib/components/TransactionStatusChecker'
import { TransactionsUIListItem } from 'lib/components/TransactionsUIListItem'
import { transactionsVar } from 'lib/apollo/cache'
import { clearPreviousTransactionsFactory } from 'lib/apollo/clearPreviousTransactionsFactory'
import { transactionsQuery } from 'lib/queries/transactionQueries'

const clearPreviousTransactions = clearPreviousTransactionsFactory(transactionsVar)

export const TransactionsList = (props) => {
  const { showDialog, closeTransactions } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext

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

  const clearPrevious = (e) => {
    e.preventDefault()
    clearPreviousTransactions()
  }


  if (!usersAddress) {
    return null
  }

  return <>
    <TransactionStatusChecker
      transactions={transactions}
    />
      
    <div
      className='flex px-6 sm:px-10 pt-6 pb-2'
    >
      <div
        className='flex flex-col w-full text-lg uppercase'
      >
        Recent transactions <div className='block sm:inline-block text-xxs text-caption'>
          {pendingTransactionsCount > 0 && <>
            {pendingTransactionsCount} pending
          </>}
        </div>

        {pastTransactionsCount > 0 && <>
          <button
            className='text-xxs text-left underline text-blue hover:text-secondary trans'
            onClick={clearPrevious}
          >
            Clear history
          </button>
        </>}
      </div>
    </div>

    <div
      className='dialog-inner-content flex-grow relative flex flex-col w-full pb-2 text-sm text-xs sm:text-sm lg:text-base'
    >
      {notCancelledTransactions.length === 0 ? <>
        <div
          className='text-default-soft px-6 sm:px-10 pb-4 uppercase text-xs'
        >
          Currently no active transactions...
        </div>
      </> : <>
          <ul
            className='transactions-ui-list overflow-x-hidden overflow-y-auto px-6 sm:px-10 py-4'
          >
            {notCancelledTransactions.map(tx => {
              return <TransactionsUIListItem
                key={tx.id}
                tx={tx}
              />
            })}
          </ul>
        </>}
    </div>
          
    
  </>
}