import { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { transactionsQuery } from 'lib/queries/transactionQueries'

export const TxRefetchListener = (props) => {
  const [storedPendingTransactions, setStoredPendingTransactions] = useState([])

  const { refetchPlayerQuery } = useContext(PoolDataContext)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions

  const pendingTransactions = transactions
    .filter(t => !t.completed && !t.cancelled)


  const runRefetch = (tx) => {
    const playerBalanceTransaction = tx.method === 'depositTo' ||
      tx.method === 'approve' ||
      tx.method === 'withdrawInstantlyFrom' ||
      tx.method === 'withdrawWithTimelockFrom' ||
      tx.method === 'sweepTimelockBalances' ||
      tx.method === 'updateAndClaimDrips'

    if (playerBalanceTransaction) {
      // refetchPlayerQuery()

      // we don't know when the Graph will have processed the new block data or when it has
      // so simply query a few times for the updated data
      setTimeout(() => {
        refetchPlayerQuery()
        console.log('refetch!')
      }, 2000)

      setTimeout(() => {
        refetchPlayerQuery()
        console.log('refetch!')
      }, 6000)

      setTimeout(() => {
        refetchPlayerQuery()
        console.log('refetch!')
      }, 12000)
    }
  }

  storedPendingTransactions.forEach(tx => {
    const storedTxId = tx.id
    const currentTxState = transactions.find((_tx) => _tx.id === storedTxId)

    if (
      currentTxState &&
      currentTxState.completed &&
      !currentTxState.error && 
      !currentTxState.cancelled
    ) {
      runRefetch(tx)
    }
  })

  if (pendingTransactions.length !== storedPendingTransactions.length) {
    setStoredPendingTransactions(pendingTransactions)
  }

  return null
}
