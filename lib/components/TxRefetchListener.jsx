import { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { transactionsQuery } from 'lib/queries/transactionQueries'

const debug = require('debug')('pool-app:TxRefetchListener')

export function TxRefetchListener(props) {
  const [storedPendingTransactions, setStoredPendingTransactions] = useState([])

  const {
    refetchPoolQuery,
    refetchPrizeStrategyQuery,
    refetchPlayerQuery,
    refetchSponsorQuery,
  } = useContext(PoolDataContext)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions

  const pendingTransactions = transactions
    .filter(t => !t.completed && !t.cancelled)


  const runRefetch = (tx) => {
    const playerBalanceTransaction = tx.method === 'depositTo' ||
      tx.method === 'transfer' ||
      tx.method === 'approve' ||
      tx.method === 'withdrawInstantlyFrom' ||
      tx.method === 'updateAndClaimDrips'

    const poolStateTransaction = tx.method === 'startAward' ||
      tx.method === 'completeAward'

    if (playerBalanceTransaction) {
      // refetchPlayerQuery()

      // we don't know when the Graph will have processed the new block data or when it has
      // so simply query a few times for the updated data
      setTimeout(() => {
        refetchPlayerQuery()
        refetchSponsorQuery()
        debug('refetch!')
      }, 2000)

      setTimeout(() => {
        refetchPlayerQuery()
        refetchSponsorQuery()
        debug('refetch!')
      }, 8000)

      setTimeout(() => {
        refetchPlayerQuery()
        refetchSponsorQuery()
        debug('refetch!')
      }, 16000)
    } else if (poolStateTransaction) {
      setTimeout(() => {
        refetchPoolQuery()
        refetchPrizeStrategyQuery()
        debug('refetch pool/prize!')
      }, 6000)
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
