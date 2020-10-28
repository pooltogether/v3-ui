import { InMemoryCache } from '@apollo/client'

import { makeVar } from '@apollo/client'

export const coingeckoDataVar = makeVar({
  id: 0,
  result: null
})

// export const gasStationDataVar = makeVar({})
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
        // gasStationData: {
        //   read() {
        //     return gasStationDataVar()
        //   },
        // },
        transactions: {
          read() {
            return transactionsVar()
          },
        }
      }
    }
  }  
})
