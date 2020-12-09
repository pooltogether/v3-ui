import {
  CONTRACT_ADDRESSES,
} from 'lib/constants'

export const getCurrentLootBox = (pool, chainId) => {
  const lootBoxAddress = CONTRACT_ADDRESSES[chainId].LootBox

  const erc721 = pool?.prizeStrategy?.externalErc721Awards?.find(erc721 => erc721.address === lootBoxAddress)
  const tokenId = erc721?.tokenIds?.[0]

  return { 
    lootBoxAddress,
    tokenId
  }
}
