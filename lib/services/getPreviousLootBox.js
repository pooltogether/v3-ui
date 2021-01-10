export const getPreviousLootBox = (pool, lootBoxAddress) => {
  // console.log(pool?.compiledExternalErc721Awards)
  let erc721Awards = pool?.compiledExternalErc721Awards || {}
  erc721Awards = Object.keys(erc721Awards)
    .map(key => erc721Awards[key])

  // console.log(erc721Awards)
  const awardedLootBox = erc721Awards?.find(award => award.address === lootBoxAddress)

  const tokenId = awardedLootBox?.tokenIds?.[0]

  return { lootBoxAddress, tokenId }
}
