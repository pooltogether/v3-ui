import { request } from 'graphql-request'

import { poolQuery } from 'lib/queries/poolQuery'
import { getSubgraphUriByContractAddress } from 'lib/utils/getSubgraphUriByContractAddress'

export const getPoolsData = async (chainId, contractAddresses, blockNumber) => {
  const poolAddress = contractAddresses.pools[0]
  
  const subgraphUri = getSubgraphUriByContractAddress(chainId, poolAddress)

  const variables = {
    poolAddress
  }
  
  const query = poolQuery(blockNumber)

  let data
  try {
    data = await request(
      subgraphUri,
      query,
      variables
    )
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data?.prizePool ? [data?.prizePool] : []
}
