import { useEffect, useContext } from 'react'

import { TRANSACTIONS_KEY } from 'lib/constants'
import { transactionsVar } from 'lib/apollo/cache'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { checkTransactionStatuses } from 'lib/utils/checkTransactionStatuses'

// bring in new list of tx's from localStorage and check
// if any are ongoing & what their status is
const readTransactions = (chainId, usersAddress, provider) => {
  try {
    let txs = []
    if (typeof window !== 'undefined') {
      const storageKey = `${chainId}-${usersAddress.toLowerCase()}-${TRANSACTIONS_KEY}`
      // console.log({ storageKey })
      
      txs = JSON.parse(
        localStorage.getItem(storageKey)
      )
      txs = txs ? txs : []
    }

    txs = txs.filter(tx => tx.sent && !tx.cancelled)

    // re-write IDs so transactions are ordered properly
    txs = txs.map((tx, index) => (tx.id = index + 1) && tx)

    console.log(`Loading ${txs.length} transactions from storage:`)
    // console.log({ txs })

    transactionsVar([...txs])
    checkTransactionStatuses(txs, provider)
  } catch (e) {
    console.error(e)
  }
}

export const TransactionStatusChecker = (props) => {
  // const { transactions } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { chainId, usersAddress, provider } = authControllerContext

  useEffect(() => {
    if (chainId && usersAddress && provider) {
      readTransactions(chainId, usersAddress, provider)
    }
  }, [chainId, usersAddress, provider])

  return null
}