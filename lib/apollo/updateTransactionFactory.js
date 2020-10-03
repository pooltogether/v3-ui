import { updateStorage } from 'lib/utils/updateStorage'

export const updateTransactionFactory = (transactionsVar) => {
  return (id, newValues) => {
    let editedTransactions = transactionsVar()
      .map((transaction) => {
        return transaction.id === id ? {
          ...transaction,
          ...newValues
        } : transaction
      })

    // runs the actual update of the data store
    transactionsVar([ ...editedTransactions ])

    // stash in localStorage to persist state between page reloads
    updateStorage(transactionsVar())
  }
}
