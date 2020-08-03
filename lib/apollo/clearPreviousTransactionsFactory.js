import { updateStorage } from 'lib/utils/updateStorage'

export const clearPreviousTransactionsFactory = (transactionsVar) => {
  return () => {
    const transactions = transactionsVar()

    const ongoingTransactions = transactions
      .filter(tx => !tx.completed)
    
    transactionsVar([...ongoingTransactions])

    // stash in localStorage to persist state between page reloads
    updateStorage(transactionsVar())
  }
}
