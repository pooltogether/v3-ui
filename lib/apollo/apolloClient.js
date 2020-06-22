// import ApolloLinkTimeout from 'apollo-link-timeout'
// import { apollo } from 'lib/dapp-core'
// import { createHttpLink } from 'apollo-link-http'
// import { withClientState } from 'apollo-link-state'
// import { ApolloLink } from 'apollo-link'
// import { ApolloClient } from 'apollo-client'
// import {
//   InMemoryCache,
//   defaultDataIdFromObject
// } from 'apollo-cache-inmemory'
// import { onError } from 'apollo-link-error'

import gql from 'graphql-tag'

// import { readProvider } from './readProvider'
// import { gasStationResolver } from 'lib/apollo/query/gasStationResolver'
// import { uniswapExchangeResolver } from 'lib/apollo/query/uniswapExchangeResolver'
// import { watchQueries } from 'lib/apollo/watchQueries'

// import { abiMapping } from './abiMapping'
// import { networkResolver } from 'lib/apollo/query/networkResolver'
// import { walletResolver } from 'lib/apollo/query/walletResolver'
// import { monkeyPatchConsoleWarn } from 'lib/utils/monkeyPatchConsoleWarn'

let client

const debug = require('debug')('pt:apolloClient')

const GRAPH_CHAIN_URIS = {
  // 1: process.env.NEXT_JS_SUBGRAPH_URI_MAINNET,
  // 4: process.env.NEXT_JS_SUBGRAPH_URI_RINKEBY,
  42: process.env.NEXT_JS_SUBGRAPH_URI_KOVAN,
  1234: process.env.NEXT_JS_SUBGRAPH_URI_KOVAN
  // 1234: process.env.NEXT_JS_SUBGRAPH_URI_LOCALHOST
}

monkeyPatchConsoleWarn()

export async function apolloClient() {
  if (client) {
    return client
  }

  debug('loading')
  // await ProviderManager.load()

  // const provider = await readProvider()
  // const network = await provider.getNetwork()

  // const defaultFromBlock = 15515802
  // let defaultFromBlock = 0
  // switch (network.chainId) {
  //   case 1:
  //     defaultFromBlock = process.env.NEXT_JS_MAINNET_DEFAULT_FROM_BLOCK || 8485000
  //     break
  //   case 4:
  //     defaultFromBlock = process.env.NEXT_JS_RINKEBY_DEFAULT_FROM_BLOCK || 5000000
  //     break
  //   case 42:
  //     defaultFromBlock = process.env.NEXT_JS_KOVAN_DEFAULT_FROM_BLOCK || 15515802
  //     break
  // }

  ////////////
  // RESOLVERS
  ////////////
  // const defaultResolvers = apollo.resolvers.boundQuery({
  //   readProvider,
  //   writeProvider
  // })

  // const resolvers = tightbeam.resolvers({
  //   Query: {
  //     gasStation: gasStationResolver,
  //     lastRevealedDrawId: lastRevealedDrawIdResolver,
  //     uniswapExchange: uniswapExchangeResolver,
  //     network: networkResolver,
  //     wallet: walletResolver,
  //     systemInfo: defaultResolvers.systemInfo
  //   },
  //   Mutation: {
  //     connectWalletMutation: connectWalletMutationFactory(tightbeam),
  //     disconnectWalletMutation: disconnectWalletMutationFactory(tightbeam),
  //   }
  // })

  ////////
  // CACHE
  ////////
  const cache = new InMemoryCache({
    assumeImmutableResults: true,
    dataIdFromObject: object => {
      let key = defaultDataIdFromObject(object)

      if (object.version) {
        key = `${key}:${object.version}`
      }

      return key
    }
  })

  const initCache = () => {
    cache.writeData({
      transactions: []
      // tightbeam.defaultCacheData()
    })
  }
  initCache()

  ///////
  // LINK
  ///////


  const customFetch = (uri, options) => {
    debug(`Original URI: ${uri}`)
    let uriOverride = process.env.NEXT_JS_SUBGRAPH_URI_KOVAN

    debug(`New chain ${network.chainId} URI: ${uriOverride}`)
    return fetch(`${uriOverride}`, options)
  }

  // const customFetch = (uri, options) => {
  //   debug(`Original URI: ${uri}`)

  //   return readProvider().then(provider => {
  //     return provider.getNetwork().then(network => {
  //       let uriOverride = GRAPH_CHAIN_URIS[network.chainId]
  //       debug(`New chain ${network.chainId} URI: ${uriOverride}`)
  //       return fetch(`${uriOverride}`, options)
  //     })
  //   })
  // }

  // 6 second timeout
  // const timeoutLink = new ApolloLinkTimeout(20000)
  // const json = (val) => JSON.stringify(val, null, 2)

  // const errorLink = onError(async (all) => {
  //   console.log({all})

  //   const {
  //     operation,
  //     response,
  //     graphQLErrors,
  //     networkError
  //   } = all
  // })
  
  // debug(`network.chainId: ${network.chainId}`)
  // debug(`SUBGRAPH URI: ${GRAPH_CHAIN_URIS[network.chainId]}`)

  const httpLink = createHttpLink({
    fetch: customFetch
  })

  // const stateLink = withClientState({
  //   cache,
  //   resolvers
  // })

  const link = ApolloLink.from([
    // errorLink,
    tightbeam.multicallLink(),
    stateLink,
    httpLink,
    // timeoutLink
  ])

  ////////////////
  // INSTANTIATION
  ////////////////
  client = new ApolloClient({
    cache,
    link,
    connectToDevTools: true
  })

  client.onResetStore(initCache)


  function cleanupClient(e) {
    if (client) {
      client.stop()
      client = null
    }

    delete e['returnValue']
  }
  window.addEventListener("beforeunload", cleanupClient)


  debug('binding account/address watchQuery...')
  watchQueries(client)
  
  if (window && window.ethereum && window.ethereum.on) {
    debug('binding network watchQuery...')
    // MetaMask claims this works but it doesn't yet:
    // window.ethereum.on('chainChanged', chainId => {
    //   document.location.reload()
    // })

    // This was causing a redirect loop:
    // window.ethereum.on('networkChanged', chainId => {
    //   document.location.reload()
    // })
  }

  window.client = client
  window.gql = gql
  window.cache = cache
  // window.ethers = ethers

  return {
    client,
    tightbeam
  }
}
