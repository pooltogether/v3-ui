import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

let client

export async function v3ApolloClient() {
  if (client) {
    return client
  }

  const cache = new InMemoryCache()

  client = new ApolloClient({
    cache,
    link: new HttpLink({
      uri: process.env.NEXT_JS_SUBGRAPH_URI_KOVAN
    })
  })

  const writeInitialCache = () => {
    cache.writeData({
      transactions: []
    })
  }

  client.onResetStore(writeInitialCache)

  return client
}
