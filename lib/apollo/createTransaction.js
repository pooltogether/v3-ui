import { updateStorageWith } from 'lib/utils/updateStorageWith'

export const createTransaction = (newTx, transactions, setTransactions) => {
  const newTransactions = [...transactions, newTx]
  setTransactions(newTransactions)
  console.log('running create with id', newTx.id)
  console.log('and txs now', newTransactions)

  // stash in localStorage to persist state between page reloads
  updateStorageWith(newTransactions)

  return newTransactions
}
