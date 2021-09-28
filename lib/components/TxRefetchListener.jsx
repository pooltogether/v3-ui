import { useState } from 'react'
import { useAtom } from 'jotai'
import { useUserTickets } from '@pooltogether/hooks'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'

import { transactionsAtom } from 'lib/atoms/transactionsAtom'

const PLAYER_BALANCE_METHODS = [
  'depositTo',
  'transfer',
  'withdrawInstantlyFrom',
  'updateAndClaimDrips'
]

const isPlayerBalanceTransaction = (tx) => {
  return PLAYER_BALANCE_METHODS.includes(tx.method)
}

export function TxRefetchListener (props) {
  const [transactions] = useAtom(transactionsAtom)

  const [storedPendingTransactions, setStoredPendingTransactions] = useState([])

  const { address: usersAddress } = useOnboard()

  const { refetch: refetchTicketData } = useUserTickets(usersAddress)

  const pendingTransactions = transactions.filter((t) => !t.completed && !t.cancelled)

  const runRefetch = (tx) => {
    if (tx?.refetch) {
      setTimeout(() => {
        tx.refetch()
      }, 2000)

      setTimeout(() => {
        tx.refetch()
      }, 8000)

      setTimeout(() => {
        tx.refetch()
      }, 16000)
    }

    if (isPlayerBalanceTransaction(tx)) {
      // we don't know when the Graph will have processed the new block data or when it has
      // so simply query a few times for the updated data
      setTimeout(() => {
        refetchTicketData()
      }, 2000)

      setTimeout(() => {
        refetchTicketData()
      }, 8000)

      setTimeout(() => {
        refetchTicketData()
      }, 16000)
    }
  }

  storedPendingTransactions.forEach((tx) => {
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
