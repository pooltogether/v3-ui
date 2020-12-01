import { updateStorageWith } from 'lib/utils/updateStorageWith'

export const updateTransaction = (id, newValues, transactions, setTransactions) => {
  let editedTransactions = transactions
    .map((transaction) => {
      return transaction.id === id ? {
        ...transaction,
        ...newValues
      } : transaction
    })
    
  // runs the actual update of the data store
  setTransactions([...editedTransactions])

  // stash in localStorage to persist state between page reloads
  updateStorageWith(editedTransactions)
}
