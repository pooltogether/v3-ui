import { CONTRACT_ADDRESSES } from 'lib/constants/contracts'
import { getLootBoxSubgraphClient } from 'lib/hooks/useSubgraphClients'
import { lootBoxesQuery, lootBoxQuery } from 'lib/queries/lootBoxQuery'

export const getGraphLootBoxesData = async (chainId, prizes, blockNumber = -1) => {
  if (prizes.length === 0) return []

  const graphQLClient = getLootBoxSubgraphClient(chainId)
  try {
    const lootBoxAddress = CONTRACT_ADDRESSES[chainId]?.lootBox?.toLowerCase()
    const query = lootBoxesQuery(lootBoxAddress, prizes)
    const response = await graphQLClient.request(query)
    return response
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getGraphLootBoxData = async (chainId, tokenIds, blockNumber = -1) => {
  const graphQLClient = getLootBoxSubgraphClient(chainId)

  const lootBoxAddress = CONTRACT_ADDRESSES[chainId]?.lootBox?.toLowerCase()

  const variables = {
    lootBoxAddress,
    tokenIds
  }

  const query = lootBoxQuery(blockNumber)

  if (tokenIds.length === 0) return []

  try {
    const response = await graphQLClient.request(query, variables)
    return response
  } catch (error) {
    console.error(error)
    return []
  }
}
