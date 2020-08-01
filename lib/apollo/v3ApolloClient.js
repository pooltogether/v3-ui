import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import { typePolicies } from 'lib/apollo/cache'

let client

export async function v3ApolloClient() {
  if (client) {
    return client
  }

  // const initialLocalAppState = {
  //   transactions: JSON.parse(window.localStorage.getItem("transactions")),
  // };

  const cache = new InMemoryCache({
    typePolicies
  })

  client = new ApolloClient({
    cache,
    link: new HttpLink({
      uri: process.env.NEXT_JS_SUBGRAPH_URI_KOVAN
    }),
  })

  return client
}
