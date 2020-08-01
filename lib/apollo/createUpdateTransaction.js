export const createUpdateTransaction = (transactionsVar) => {
  return (id, newValues) => {
    console.log({id, newValues})
    let transactionsWithEditedTodo = transactionsVar()
      .map((transaction) => {
        return transaction.id === id ? {
          ...transaction,
          ...newValues
        } : transaction
      })
    console.log({ transactionsWithEditedTodo })

    transactionsVar(transactionsWithEditedTodo)
  }
}
