import { transactionsVar } from 'lib/apollo/cache'
import { callTransaction } from 'lib/utils/callTransaction'

export const useSendTransaction = function (txName) {
  const sendTx = (
    provider,
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
    console.log({ newTx })

    transactionsVar([...transactions, newTx])

    callTransaction(
      newTx,
      provider,
      contractAddress,
      contractAbi,
      method,
      params,
    )

    return txId
  }

  return [sendTx]
}
