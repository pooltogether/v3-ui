// import { gql } from 'graphql-request'

// import { CUSTOM_CONTRACT_ADDRESSES } from 'lib/constants'
// import { getUniswapSubgraphClient } from 'lib/utils/getSubgraphClients'

// const QUERY_TEMPLATE = `token__num__: tokens(where: { id: "__address__" } __blockFilter__) {
//   id
//   derivedETH
// }`

// const _addStablecoin = (addresses, usdtAddress) => {
//   const usdt = addresses.find((address) => usdtAddress === address)

//   if (!usdt) {
//     addresses.splice(0, 0, usdtAddress)
//   }

//   return addresses
// }

// const _getBlockFilter = (blockNumber) => {
//   let blockFilter = ''

//   if (blockNumber > 0) {
//     blockFilter = `, block: { number: ${blockNumber} }`
//   }

//   return blockFilter
// }

// const _calculateUsd = (token) => {
//   let derivedETH = token?.derivedETH

//   if (!derivedETH || derivedETH === '0') {
//     derivedETH = 0.2 // 1 ETH is $5 USD, used for Rinkeby, etc
//   }

//   return 1 / derivedETH
// }
