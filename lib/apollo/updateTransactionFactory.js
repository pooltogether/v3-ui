import { updateStorage } from 'lib/utils/updateStorage'

export const updateTransactionFactory = (transactionsVar) => {
  return (id, newValues) => {
    let transactionsWithEditedTodo = transactionsVar()
      .map((transaction) => {
        return transaction.id === id ? {
          ...transaction,
          ...newValues
        } : transaction
      })
    console.log({ transactionsWithEditedTodo })

    // runs the actual update of the data store
    transactionsVar(transactionsWithEditedTodo)

    // stash in localStorage to persist state between page reloads
    updateStorage(transactionsVar())
  }
}
