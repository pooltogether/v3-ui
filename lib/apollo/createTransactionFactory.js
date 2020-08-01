import { updateStorage } from 'lib/utils/updateStorage'

export const createTransactionFactory = (transactionsVar) => {
  return (newTx) => {
    const transactions = transactionsVar()
    transactionsVar([...transactions, newTx])

    // stash in localStorage to persist state between page reloads
    updateStorage(transactionsVar())
  }
}
