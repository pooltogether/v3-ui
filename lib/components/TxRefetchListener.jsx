import { useContext, useState } from 'react'
import { useAtom } from 'jotai'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { useUserTickets } from 'lib/hooks/useUserTickets'

const PLAYER_BALANCE_METHODS = [
  'depositTo',
  'transfer',
  'withdrawInstantlyFrom',
  'updateAndClaimDrips'
]

const isPlayerBalanceTransaction = (tx) => {
  return PLAYER_BALANCE_METHODS.includes(tx.method)
}

export function TxRefetchListener(props) {
  const [transactions] = useAtom(transactionsAtom)

  const [storedPendingTransactions, setStoredPendingTransactions] = useState([])

  const { usersAddress } = useContext(AuthControllerContext)

  const { refetch: refetchTicketData } = useUserTickets(usersAddress)

  const pendingTransactions = transactions.filter((t) => !t.completed && !t.cancelled)

  const runRefetch = (tx) => {
    if (tx?.refetch) {
      setTimeout(() => {
        tx.refetch()
        console.log('refetch 4!')
      }, 2000)

      setTimeout(() => {
        tx.refetch()
        console.log('refetch 5!')
      }, 8000)

      setTimeout(() => {
        tx.refetch()
        console.log('refetch 5!')
      }, 16000)
    }

    console.log(' is player b tx? ', isPlayerBalanceTransaction(tx))

    if (isPlayerBalanceTransaction(tx)) {
      // we don't know when the Graph will have processed the new block data or when it has
      // so simply query a few times for the updated data
      setTimeout(() => {
        refetchTicketData()
        console.log('refetch 1!')
      }, 2000)

      setTimeout(() => {
        refetchTicketData()
        console.log('refetch 2!')
      }, 8000)

      setTimeout(() => {
        refetchTicketData()
        console.log('refetch 3!')
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
