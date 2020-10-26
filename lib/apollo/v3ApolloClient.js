import { ApolloLink, ApolloClient, HttpLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import Cookies from 'js-cookie'

import { SELECTED_WALLET_COOKIE_KEY, STORED_CHAIN_ID_KEY } from 'lib/constants'
import { cache } from 'lib/apollo/cache'
import { networkNameToChainId } from 'lib/utils/networkNameToChainId'
import { poolToast } from 'lib/utils/poolToast'

const debug = require('debug')('pool-app:v3ApolloClient')

let client

const GRAPH_CHAIN_URIS = {
  1: process.env.NEXT_JS_SUBGRAPH_URI_MAINNET,
  3: process.env.NEXT_JS_SUBGRAPH_URI_ROPSTEN,
  4: process.env.NEXT_JS_SUBGRAPH_URI_RINKEBY,
  // 42: process.env.NEXT_JS_SUBGRAPH_URI_KOVAN,
  // 1234: process.env.NEXT_JS_SUBGRAPH_URI_LOCALHOST
}

export async function v3ApolloClient() {
  if (client) {
    return client
  }

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        console.log(locations)
        console.warn(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      })
    }

    // The unexpected token JSON errors are when you're on an unsupported Eth network
    if (
      networkError?.message.match('Unexpected token < in JSON at position 0') ||
      networkError?.message.match('unexpected character at line 1 column 1 of the JSON data')
    ) {
      console.log(`[Network error]: ${networkError}`)
    } else if (networkError) {
      if (networkError.message === 'Failed to fetch') {
        window.showGraphError()
      }

      console.warn(`[Network error]: ${networkError}`)
    }
  })

  const customFetch = async (uri, options) => {
    let defaultChainId = networkNameToChainId(process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME)
    let storedChainId = Cookies.get(STORED_CHAIN_ID_KEY)
    let selectedWallet = Cookies.get(SELECTED_WALLET_COOKIE_KEY)

    const chainId = storedChainId && selectedWallet ? 
      storedChainId :
      defaultChainId

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

  const createAndStartApollo = () => {
    debug('APOLLO: creating and starting apollo ..')
    client = new ApolloClient({
      cache,
      link
    })
    debug('APOLLO: started ...')
  }

  const destroyApollo = async () => {
    debug('APOLLO: stopping ...')

    if (client) {
      client.stop()
      debug('APOLLO: stopped ...')
  
      client = null
      debug('APOLLO: nulled ...')
    }
  }

  const resetApollo = async () => {
    // console.log('run reset store')
    // client.cache.reset()
    // client.resetStore()

    // should have been: clearStore() instead of resetStore() so we don't refetch
    // queries right away!

    destroyApollo()
    createAndStartApollo()
  }

  window.createAndStartApollo = createAndStartApollo
  window.destroyApollo = destroyApollo
  window.resetApollo = resetApollo

  window.addEventListener("beforeunload", function (e) {
    debug('before unload')
    window.destroyApollo()
  })

  createAndStartApollo()

  return client
}
