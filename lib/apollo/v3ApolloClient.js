import { makeVar, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import { transactions } from 'lib/apollo/typePolicies'

let client

export async function v3ApolloClient() {
  if (client) {
    return client
  }


  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          transactions
        }
      }
    }
  })

  client = new ApolloClient({
    cache,
    link: new HttpLink({
      uri: process.env.NEXT_JS_SUBGRAPH_URI_KOVAN
    }),
  })

  // const writeInitialCache = () => {
  //   cache.writeData({
  //     data: {
  //       isLoggedIn: !!localStorage.getItem('token'),
  //       cartItems: []        
  //     },
  //     transactions: []
  //   })
  // }
  // writeInitialCache()

  // client.onResetStore(writeInitialCache)

  return client
}
