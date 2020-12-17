export const getLootBoxAwards = (lootBox, historical) => {
  const erc20Balances = lootBox?.erc20Balances || []
  const erc721Tokens = lootBox?.erc721Tokens || []

  const erc20Awards = [
    ...erc20Balances
  ]

  const erc721Awards = [
    ...erc721Tokens
  ]

  return {
    erc20Awards,
    erc721Awards
  }
}
