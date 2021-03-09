export const getCurrentLootBox = (pool, lootBoxAddress) => {
  const erc721 = pool?.compiledExternalErc721Awards?.find(
    (erc721) => erc721.address === lootBoxAddress
  )
  const tokenId = erc721?.tokenId

  return {
    lootBoxAddress,
    tokenId
  }
}
