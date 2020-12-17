export const uniswapTokensToQuery = (erc20Balances = {}) => {
  const balanceProperty = 'balance'
  // const balanceProperty = historical ? 'balanceAwardedBN' : 'balance'

  erc20Balances = Object.keys(erc20Balances)
    .map(key => erc20Balances[key])
    .filter(award => Number(award?.[balanceProperty]) > 0)

  const addresses = erc20Balances ?
    erc20Balances
      .map(erc20Balance => erc20Balance.erc20Entity.id) :
    []

  return { addresses }
}
