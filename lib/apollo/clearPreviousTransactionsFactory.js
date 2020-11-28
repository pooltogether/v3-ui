import { useAtom } from 'jotai'

import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { updateStorage } from 'lib/utils/updateStorage'

export const clearPreviousTransactionsFactory = (
  // transactionsVar,
  usersAddress,
  chainId
) => {
  return () => {
    const [transactions, setTransactions] = useAtom(transactionsAtom)
    // const transactions = transactionsVar()

    const ongoingTransactions = transactions
      .filter(tx => !tx.completed)
    
    setTransactions([...ongoingTransactions])

    // stash in localStorage to persist state between page reloads
    updateStorage(
      transactions,
      usersAddress,
      chainId
    )
  }
}
