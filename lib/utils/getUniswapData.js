import { request } from 'graphql-request'

import { CONTRACT_ADDRESSES } from 'lib/constants'
import { uniswapTokensQuery } from 'lib/queries/uniswapTokensQuery'

const UNISWAP_GRAPH_URIS = {
  1: process.env.NEXT_JS_UNISWAP_SUBGRAPH_URI_MAINNET, // https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2
  3: process.env.NEXT_JS_UNISWAP_SUBGRAPH_URI_ROPSTEN, 
  4: process.env.NEXT_JS_UNISWAP_SUBGRAPH_URI_RINKEBY, // https://api.thegraph.com/subgraphs/name/blockrockettech/uniswap-v2-subgraph-rinkeby
}

const _addStablecoin = (usdtAddress, addresses) => {
  const usdt = addresses.find(address => usdtAddress === address)

  if (!usdt) {
    addresses.splice(0, 0, usdtAddress)
  }

  return addresses
}

export const getUniswapData = async (chainId, addresses, blockNumber) => {
  // We'll use this stablecoin to measure the price of ETH off of
  const stablecoinAddress = CONTRACT_ADDRESSES[chainId]?.['Usdt']

  _addStablecoin(
    stablecoinAddress,
    addresses
  )

  const variables = {
    ids: addresses
  }

  const query = uniswapTokensQuery(blockNumber)

  let data
  try {
    data = await request(
      UNISWAP_GRAPH_URIS[1],
      query,
      variables
    )

    // unpack the data into a useful object 
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i]
      const token = data.tokens.find(token => token.id === address)

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
  } catch (error) {
    console.warn(error)
    console.error(JSON.stringify(error, undefined, 2))
  }


  return data
}
