import { InMemoryCache } from '@apollo/client'

import { makeVar } from '@apollo/client'

export const coingeckoDataVar = makeVar([])
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
