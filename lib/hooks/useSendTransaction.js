// import { transactionsVar } from 'lib/apollo/cache'
import { callTransaction } from 'lib/utils/callTransaction'
import { createTransactionFactory } from 'lib/apollo/createTransactionFactory'
// import { updateStorage } from 'lib/utils/updateStorage'

export const useSendTransaction = function (txName, transactions, setTransactions) {
  const sendTx = (
    t,
    provider,
    usersAddress,
    contractAbi,
    contractAddress,
    method,
    params = []
  ) => {
    const createTransaction = createTransactionFactory(transactions, setTransactions)

    // const transactions = transactionsVar()
    const txId = transactions.length + 1
    console.log(transactions)
    console.log(txId)

    let newTx = {
      __typename: 'Transaction',
      id: txId,
      name: txName,
      inWallet: true,
      method,
      hash: '',
    }

    // setTransactions([...transactions, newTx])
    // // stash tx in localStorage to persist state between page reloads
    // updateStorage(transactions)
    createTransaction(newTx)

    callTransaction(
      t,
      transactions,
      setTransactions,
      newTx,
      provider,
      usersAddress,
      contractAbi,
      contractAddress,
      method,
      params,
    )

    return txId
  }

  return [sendTx]
}
