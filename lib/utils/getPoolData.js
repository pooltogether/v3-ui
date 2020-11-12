import { request } from 'graphql-request'

import { poolsQuery } from 'lib/queries/poolsQuery'

const POOLTOGETHER_GRAPH_URIS = {
  1: process.env.NEXT_JS_SUBGRAPH_URI_MAINNET, 
  3: process.env.NEXT_JS_SUBGRAPH_URI_ROPSTEN, 
  4: process.env.NEXT_JS_SUBGRAPH_URI_RINKEBY, 
}

export const getPoolData = async (poolAddress, blockNumber) => {
  const variables = {
    ids: [poolAddress]
  }

  const query = poolsQuery(blockNumber)

  // build a query selection set from all the pools addresses
  const data = await request(
    POOLTOGETHER_GRAPH_URIS[1],
    query,
    variables
  )

  return data.prizePools
}
