import { request, gql } from 'graphql-request'

const UNISWAP_GRAPH_URIS = {
  1: process.env.NEXT_JS_UNISWAP_SUBGRAPH_URI_MAINNET,
  3: process.env.NEXT_JS_UNISWAP_SUBGRAPH_URI_ROPSTEN,
  4: process.env.NEXT_JS_UNISWAP_SUBGRAPH_URI_RINKEBY,
}

const QUERY_TEMPLATE = `token__num__: tokens(where: { id: "__address__" } __blockFilter__) {
  id
  derivedETH
}`

export const getUniswapData = async (addresses, blockNumber) => {
  let blockFilter = ''

  if (blockNumber) {
    blockFilter = `, block: { number: ${blockNumber} }`
  }


  // build a query selection set from all the token addresses
  let query = ``
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i]

    const selection = QUERY_TEMPLATE
      .replace('__num__', i)
      .replace('__address__', address)
      .replace('__blockFilter__', blockFilter)

    query = `${query}\n${selection}`
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

  // test
  for (let i = 0; i < 10; i++) {
    const address = addresses[i]
  }

  return data
}
