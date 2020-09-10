import { transactionsVar } from 'lib/apollo/cache'
import { callTransaction } from 'lib/utils/callTransaction'
import { createTransactionFactory } from 'lib/apollo/createTransactionFactory'

const createTransaction = createTransactionFactory(transactionsVar)

export const useSendTransaction = function (txName, refetchQuery) {
  const sendTx = (
    t,
    provider,
    usersAddress,
    contractAbi,
    contractAddress,
    method,
    params = []
  ) => {
    const transactions = transactionsVar()
    const txId = transactions.length + 1

    let newTx = {
      __typename: 'Transaction',
      id: txId,
      name: txName,
      inWallet: true,
      method,
      hash: '',
    }

    createTransaction(newTx)

    callTransaction(
      t,
      newTx,
      provider,
      usersAddress,
      contractAddress,
      contractAbi,
      method,
      refetchQuery,
      params,
    )

    return txId
  }

  return [sendTx]
}
