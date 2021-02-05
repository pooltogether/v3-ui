import { updateStorageWith } from 'lib/utils/updateStorageWith'

export const clearPreviousTransactions = (transactions, setTransactions, usersAddress, chainId) => {
  // const ongoingTransactions = transactions
  //   .filter(tx => !tx.completed)
  // setTransactions([...ongoingTransactions])

  setTransactions([])

  updateStorageWith([], usersAddress, chainId)
}
