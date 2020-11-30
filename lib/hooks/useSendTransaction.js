import { callTransaction } from 'lib/utils/callTransaction'
import { createTransaction } from 'lib/apollo/createTransaction'

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
    const txId = transactions.length + 1

    let newTx = {
      __typename: 'Transaction',
      id: txId,
      name: txName,
      inWallet: true,
      method,
      hash: '',
    }

    transactions = createTransaction(newTx, transactions, setTransactions)

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
