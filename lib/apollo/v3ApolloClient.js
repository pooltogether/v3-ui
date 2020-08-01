import { ApolloClient, HttpLink } from '@apollo/client'

import { cache } from 'lib/apollo/cache'

let client

export async function v3ApolloClient() {
  if (client) {
    return client
  }

  client = new ApolloClient({
    cache,
    link: new HttpLink({
      uri: process.env.NEXT_JS_SUBGRAPH_URI_KOVAN
    }),
  })

  return client
}
