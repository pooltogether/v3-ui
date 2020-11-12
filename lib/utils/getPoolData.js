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

  let data
  try {
    data = await request(
      POOLTOGETHER_GRAPH_URIS[1],
      query,
      variables
    )
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data.prizePools
}
