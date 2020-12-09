import { request } from 'graphql-request'

import { accountQuery } from 'lib/queries/accountQuery'
import { getPoolSubgraphUri } from 'lib/utils/getPoolSubgraphUri'

export const getAccountData = async (chainId, accountAddress, blockNumber) => {
  const poolSubgraphUri = getPoolSubgraphUri(chainId, blockNumber)

  const query = accountQuery(blockNumber)

  const variables = {
    accountAddress,
  }

  let data
  try {
    data = await request(
      poolSubgraphUri,
      query,
      variables
    )
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data?.accounts?.[0]
}
