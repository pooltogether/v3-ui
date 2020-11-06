import { useQuery } from 'react-query'

import {
  UNISWAP_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { request, gql } from 'graphql-request'

const UNISWAP_GRAPH_URIS = {
  1: process.env.NEXT_JS_UNISWAP_SUBGRAPH_URI_MAINNET,
  3: process.env.NEXT_JS_UNISWAP_SUBGRAPH_URI_ROPSTEN,
  4: process.env.NEXT_JS_UNISWAP_SUBGRAPH_URI_RINKEBY,
}

const QUERY_TEMPLATE = `token__num__: tokens(where: { id: "__address__" }) {
  id
  derivedETH
}`

const getUniswapData = async (_, addresses) => {
  // build a query selection set from all the token addresses
  let query = ``
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i]

    query = `${query}\n${QUERY_TEMPLATE.replace('__num__', i).replace('__address__', address)}`
  }

  const response = await request(
    UNISWAP_GRAPH_URIS[1],
    gql`
      query uniswapTokensQuery {
        ${query}
      }
    `
  )

  // unpack the data into a useful object 
  let data = {}
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i]
    const token = response[`token${i}`][0]

    data[address] = token
  }
console.log(data)
  return data
}

export function useUniswapTokensQuery(addresses) {
  return useQuery(
    [QUERY_KEYS.uniswapTokensQuery, addresses],
    getUniswapData,
    { 
      enabled: addresses,
      refetchInterval: UNISWAP_POLLING_INTERVAL
    }
  )
}
