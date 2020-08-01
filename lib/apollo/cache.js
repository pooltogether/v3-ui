import { InMemoryCache } from '@apollo/client'

import { makeVar } from '@apollo/client'

export const transactionsVar = makeVar([])

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        transactions: {
          read() {
            console.log('read run')
            // const txs = JSON.parse(
            //   localStorage.getItem('pt-transactions')
            // )
            // console.log({ txs })
            // const txs = []

            return transactionsVar()
          },
        }
      }
    }
  }  
})
