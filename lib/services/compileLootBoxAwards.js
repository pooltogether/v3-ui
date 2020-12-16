export const compileLootBoxAwards = (lootBox, historical) => {
  // mash the top-level 721s, 20s and anything in the lootbox together:
  // UPDATE: DESCRIPTION
  // UPDATE: LootBoxValue

  const sortedAwards = orderBy(allAwards, ({ value }) => value || '', ['desc'])
  const awards = moreVisible ? sortedAwards : sortedAwards?.slice(0, 10)
  // const sortedAwards = orderBy(compiledErc20s, ({ value }) => value || '', ['desc'])
  // const awards = moreVisible ? sortedAwards : sortedAwards?.slice(0, 10)
    
  return {
    addresses,
    allLootBoxAwards
  }
}
