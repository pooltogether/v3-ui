import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

let client

const debug = require('debug')('pt:apolloClient')

export async function newApolloClient() {
  if (client) {
    return client
  }

  client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_JS_SUBGRAPH_URI_KOVAN
    })
  })

  return client

  debug('loading')

  // return {
  //   client,
  // }
}
