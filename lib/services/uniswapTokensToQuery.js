export const uniswapTokensToQuery = (erc20Awards = {}) => {
  const balanceProperty = 'balance'
  // const balanceProperty = historical ? 'balanceAwardedBN' : 'balance'

  erc20Awards = Object.keys(erc20Awards)
    .map(key => erc20Awards[key])
    .filter(award => Number(award?.[balanceProperty]) > 0)

  const addresses = erc20Awards ?
    erc20Awards
      .map(award => award.address) :
    []

  return { addresses }
}
