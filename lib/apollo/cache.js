import { InMemoryCache } from '@apollo/client'

import { makeVar } from '@apollo/client'

export const transactionsVar = makeVar([])

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        transactions: {
          read() {
            const txs = JSON.parse(
              localStorage.getItem('transactions')
            )

            return transactionsVar(txs || [])
          },
        }
      }
    }
  }  
})
