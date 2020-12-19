export const getCurrentLootBox = (pool, lootBoxAddress) => {
  const erc721 = pool?.externalErc721Awards?.find(erc721 => erc721.address === lootBoxAddress)
  const tokenId = erc721?.tokenIds?.[0]

  return { 
    lootBoxAddress,
    tokenId
  }
}
