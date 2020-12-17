export const uniswapTokensToQuery = (erc20Awards = {}) => {
  const balanceProperty = 'balance'
  // const balanceProperty = historical ? 'balanceAwardedBN' : 'balance'

  erc20Awards = Object.keys(erc20Awards)
    .map(key => erc20Awards[key])
    .filter(award => Number(award?.[balanceProperty]) > 0)
    .filter(award => Boolean(award.erc20Entity))

  console.log(erc20Awards.length)
  const addresses = erc20Awards ?
    erc20Awards
      .map(award => award.erc20Entity.id) :
    []

  return { addresses }
}
