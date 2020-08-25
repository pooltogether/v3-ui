import { ApolloClient, HttpLink } from '@apollo/client'
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

  const customFetch = async (uri, options) => {
    let chainId = Cookies.get(STORED_CHAIN_ID_KEY) ? 
      Cookies.get(STORED_CHAIN_ID_KEY) :
      networkNameToChainId(NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME)
    // console.log('chainId', chainId)

    let uriOverride = GRAPH_CHAIN_URIS[chainId]
    // console.log({ uriOverride})

    return fetch(
      uriOverride,
      options
    )
  }

  client = new ApolloClient({
    cache,
    link: new HttpLink({
      fetch: customFetch
    }),
  })

  return client
}
