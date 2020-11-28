import { updateStorage } from 'lib/utils/updateStorage'

export const createTransactionFactory = (transactions, setTransactions) => {
  return (newTx) => {
    // const transactions = transactionsVar()
    setTransactions([...transactions, newTx])
    console.log('running create with id', newTx.id)

    // stash in localStorage to persist state between page reloads
    updateStorage(transactions)
  }
}
