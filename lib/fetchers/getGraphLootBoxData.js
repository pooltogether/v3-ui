import { request } from 'graphql-request'

import { LOOTBOX_GRAPH_URIS } from 'lib/constants'
import { lootBoxQuery } from 'lib/queries/lootBoxQuery'

export const getGraphLootBoxData = async (chainId, lootBoxAddress, tokenId, blockNumber) => {
  const variables = {
    lootBoxAddress,
    tokenId,
  }

  const query = lootBoxQuery(blockNumber)
  console.log(variables)
  console.log(query)
  console.log(blockNumber)

  let response
  try {
    response = await request(
      LOOTBOX_GRAPH_URIS[chainId],
      query,
      variables
    )
    console.log(response)
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return response
}
