import { request, gql } from 'graphql-request'

import { CONTRACT_ADDRESSES } from 'lib/constants'

const UNISWAP_GRAPH_URIS = {
  1: process.env.NEXT_JS_UNISWAP_SUBGRAPH_URI_MAINNET, // https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2
  3: process.env.NEXT_JS_UNISWAP_SUBGRAPH_URI_ROPSTEN, 
  4: process.env.NEXT_JS_UNISWAP_SUBGRAPH_URI_RINKEBY, // https://api.thegraph.com/subgraphs/name/blockrockettech/uniswap-v2-subgraph-rinkeby
}

const QUERY_TEMPLATE = `token__num__: tokens(where: { id: "__address__" } __blockFilter__) {
  id
  derivedETH
}`

const _addStablecoin = (usdtAddress, addresses) => {
  const usdt = addresses.find(address => usdtAddress === address)

  if (!usdt) {
    addresses.splice(0, 0, usdtAddress)
  }

  return addresses
}

const _getBlockFilter = (blockNumber) => {
  let blockFilter = ''

  if (blockNumber) {
    blockFilter = `, block: { number: ${blockNumber} }`
  }

  return blockFilter
}

export const getUniswapData = async (chainId, addresses, blockNumber) => {
  const blockFilter = _getBlockFilter(blockNumber)

  // We'll use this stablecoin to measure the price of ETH off of
  const stablecoinAddress = CONTRACT_ADDRESSES[chainId]?.['Usdt']

  _addStablecoin(
    stablecoinAddress,
    addresses
  )

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

  // calculate and cache the price of eth in the data object 
  data['ethereum'] = {
    derivedETH: '1',
    id: 'eth',
    usd: 1 / data[stablecoinAddress].derivedETH
  }

  // calculate the price of the token in USD
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i]
    const token = data[address]

    if (token) {
      data[address] = {
        ...token,
        usd: data['ethereum'].usd * parseFloat(token.derivedETH)
      }
    }
  }

  return data
}
