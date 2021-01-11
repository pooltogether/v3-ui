export const getPreviousLootBox = (externalErcAwards, lootBoxAddress) => {
  let erc721Awards = externalErcAwards?.compiledExternalErc721Awards || {}
  erc721Awards = Object.keys(erc721Awards)
    .map(key => erc721Awards[key])

  const awardedLootBox = erc721Awards
    ?.find(award => award.address === lootBoxAddress)

  const tokenId = awardedLootBox?.tokenId

  return { lootBoxAddress, tokenId }
}
