import { request } from 'graphql-request'

import { POOLTOGETHER_CURRENT_GRAPH_URIS } from 'lib/constants'
import { poolQuery } from 'lib/queries/poolQuery'
// import { getSubgraphUriByContractAddress } from 'lib/utils/getSubgraphUriByContractAddress'

export const getPoolsData = async (chainId, poolAddresses, blockNumber) => {
  const poolAddress = poolAddresses?.[0]
  // const poolAddress = poolAddresses.pools[0]
  
  // const subgraphUri = getSubgraphUriByContractAddress(chainId, poolAddress)

  const variables = {
    poolAddress
  }
  
  const query = poolQuery(blockNumber)

  // https://thegraph.com/explorer/subgraph/pooltogether/rinkeby-v3
  let data
  try {
    data = await request(
      POOLTOGETHER_CURRENT_GRAPH_URIS[chainId],
      query,
      variables
    )
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data?.prizePool ? [data?.prizePool] : []
}
