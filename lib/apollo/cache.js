import { InMemoryCache } from '@apollo/client'

import { makeVar } from '@apollo/client'

export const coingeckoDataVar = makeVar({
  id: 0,
  result: null
})

export const transactionsVar = makeVar([])

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        coingeckoData: {
          read() {
            return coingeckoDataVar()
          },
        },
        transactions: {
          read() {
            return transactionsVar()
          },
        }
      }
    }
  }  
})
