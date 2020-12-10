import { request } from 'graphql-request'

import { accountQuery } from 'lib/queries/accountQuery'
import { getSubgraphUri } from 'lib/utils/getSubgraphUri'

export const getAccountData = async (chainId, accountAddress, blockNumber) => {
  const poolSubgraphUri = getSubgraphUri(chainId, blockNumber)

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
