export const getLootBoxAwards = (lootBox, pool) => {
  console.log(pool)
  console.log(pool?.compiledExternalErc20Awards)
  const topLevelErc20s = pool?.compiledExternalErc20Awards || []
  const topLevelErc721s = pool?.compiledExternalErc721Awards || []
  // const topLevelErc20s = pool?.externalErc20Awards || []
  // const topLevelErc721s = pool?.externalErc721Awards || []

  const erc20Balances = lootBox?.erc20Balances || []
  const erc721Tokens = lootBox?.erc721Tokens || []
  const erc1155Tokens = lootBox?.erc1155Balances || []

  const erc20Awards = [
    ...topLevelErc20s,
    ...erc20Balances
  ]

  const erc721Awards = [
    ...topLevelErc721s,
    ...erc721Tokens
  ]
  
  const erc1155Awards = [
    ...erc1155Tokens
  ]

  return {
    erc20Awards,
    erc721Awards,
    erc1155Awards
  }
}
