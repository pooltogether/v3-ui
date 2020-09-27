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
    .filter(t => !t.completed)

  const runRefetch = (tx) => {
    if (tx.method === 'depositTo') {
      refetchPlayerQuery()

      // we don't know when the Graph will have processed the new block data or when it has
      // so simply query a few times for the updated data
      setTimeout(() => {
        refetchPlayerQuery()
      }, 500)

      setTimeout(() => {
        refetchPlayerQuery()
      }, 2000)
    }
  }

  storedPendingTransactions.forEach(tx => {
    const storedTxId = tx.id
    const currentTxState = transactions.find((_tx) => _tx.id === storedTxId)

    if (currentTxState.completed && !currentTxState.error) {
      runRefetch(tx)
    }
  })

  if (pendingTransactions.length !== storedPendingTransactions.length) {
    setStoredPendingTransactions(pendingTransactions)
  }

  return null
}
