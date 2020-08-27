import { ApolloLink, ApolloClient, HttpLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import Cookies from 'js-cookie'

import { STORED_CHAIN_ID_KEY } from 'lib/constants'
import { cache } from 'lib/apollo/cache'
import { networkNameToChainId } from 'lib/utils/networkNameToChainId'

let client

const GRAPH_CHAIN_URIS = {
  // 1: process.env.NEXT_JS_SUBGRAPH_URI_MAINNET,
  4: process.env.NEXT_JS_SUBGRAPH_URI_RINKEBY,
  42: process.env.NEXT_JS_SUBGRAPH_URI_KOVAN,
  // 1234: process.env.NEXT_JS_SUBGRAPH_URI_LOCALHOST
}

export async function v3ApolloClient() {
  if (client) {
    return client
  }

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.warn(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      )
    }

    if (networkError.message.match('Unexpected token < in JSON at position 0')) {
      console.log(`[Network error]: ${networkError}`)
    } else if (networkError) {
      console.warn(`[Network error]: ${networkError}`)
    }
  })

  const customFetch = async (uri, options) => {
    let chainId = Cookies.get(STORED_CHAIN_ID_KEY) ? 
      Cookies.get(STORED_CHAIN_ID_KEY) :
      networkNameToChainId(NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME)

    let uriOverride = GRAPH_CHAIN_URIS[chainId]

    return fetch(
      uriOverride,
      options
    )
  }

  const link = ApolloLink.from([
    errorLink,
    new HttpLink({
      fetch: customFetch
    }),
  ])

  client = new ApolloClient({
    cache,
    link
  })

  return client
}
