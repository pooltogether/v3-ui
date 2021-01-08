export const getPreviousLootBox = (pool, lootBoxAddress) => {
  let erc721Awards = pool?.compiledExternalErc721Awards || {}
  erc721Awards = Object.keys(erc721Awards)
    .map(key => erc721Awards[key])

  const awardedLootBox = erc721Awards?.find(award => award.address === lootBoxAddress)

  const tokenId = awardedLootBox?.tokenIds?.[0]

  return { lootBoxAddress, tokenId }
}
