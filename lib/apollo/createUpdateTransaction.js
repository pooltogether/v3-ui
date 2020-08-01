const updateTransactionsInLocalStorage = (transactions) => {
  const sentTransactions = transactions.filter(tx => tx.sent)

  const txsToStore = JSON.stringify(sentTransactions)

  try {
    localStorage.setItem('transactions', txsToStore)
  } catch (e) {
    console.warn(e)
  }
}

export const createUpdateTransaction = (transactionsVar) => {
  return (id, newValues) => {
    let transactionsWithEditedTodo = transactionsVar()
      .map((transaction) => {
        console.log(transaction.id)
        console.log(id)

        return transaction.id === id ? {
          ...transaction,
          ...newValues
        } : transaction
      })
    console.log({ transactionsWithEditedTodo })

    // runs the actual update of the data store
    transactionsVar(transactionsWithEditedTodo)

    // stash in localStorage to persist state between page reloads
    updateTransactionsInLocalStorage(transactionsVar())
  }
}
