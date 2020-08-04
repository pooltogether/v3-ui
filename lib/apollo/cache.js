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
