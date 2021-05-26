import { useAtom } from 'jotai'

import { useTranslation } from 'react-i18next'
import { callTransaction } from 'lib/utils/callTransaction'
import { createTransaction } from 'lib/services/createTransaction'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { useOnboard } from '@pooltogether/hooks'

export const useSendTransaction = function () {
  const [transactions, setTransactions] = useAtom(transactionsAtom)
  const { onboard } = useOnboard()
  const { address: usersAddress, provider } = useOnboard()

  const { t } = useTranslation()

  const sendTx = async (txName, contractAbi, contractAddress, method, params = [], refetch) => {
    await onboard.walletCheck()

    const txId = transactions.length + 1

    let newTx = {
      __typename: 'Transaction',
      id: txId,
      name: txName,
      inWallet: true,
      method,
      hash: '',
      refetch
    }

    let updatedTransactions = createTransaction(newTx, transactions, setTransactions)

    callTransaction(
      t,
      updatedTransactions,
      setTransactions,
      newTx,
      provider,
      usersAddress,
      contractAbi,
      contractAddress,
      method,
      params
    )

    return txId
  }

  return sendTx
}
