import { InMemoryCache } from '@apollo/client'

import { makeVar } from '@apollo/client'

const transactions = () => {
  try {
    let txs
    if (typeof window !== 'undefined') {
      txs = JSON.parse(
        localStorage.getItem('pt-transactions')
      )
    }

    txs = txs.filter(tx => tx.sent && !tx.cancelled)

    // re-write IDs so transactions are ordered properly
    txs = txs.map((tx, index) => (tx.id = index + 1) && tx)

    console.log(`Loading ${txs.length} transactions from storage:`)
    console.log({txs})

    return txs || []
  } catch (e) {
    console.warn(e)
  }
}

export const transactionsVar = makeVar(transactions())

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        transactions: {
          read() {
            return transactionsVar()
          },
        }
      }
    }
  }  
})
