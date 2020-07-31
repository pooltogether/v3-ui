import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import { transactions } from 'lib/apollo/cache'
console.log(transactions)

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

  return client
}
