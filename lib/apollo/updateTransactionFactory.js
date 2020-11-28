import { updateStorage } from 'lib/utils/updateStorage'

export const updateTransactionFactory = (transactions, setTransactions) => {
  return (id, newValues) => {
    let editedTransactions = transactions
      .map((transaction) => {
        return transaction.id === id ? {
          ...transaction,
          ...newValues
        } : transaction
      })

    // runs the actual update of the data store
    setTransactions([ ...editedTransactions ])

    // stash in localStorage to persist state between page reloads
    updateStorage(transactions)
  }
}
