export const getLootBoxAwards = (lootBox, historical) => {
  const balanceProperty = 'balance'
  // const balanceProperty = historical ? 'balanceAwardedBN' : 'balance'

  let erc20Balances = lootBox?.erc20Balances || {}``
  erc20Balances = Object.keys(erc20Balances)
    .map(key => erc20Balances[key])
    .filter(award => Number(award?.[balanceProperty]) > 0)

  const addresses = erc20Balances ?
    erc20Balances
      .map(erc20Balance => erc20Balance.erc20Entity.id) :
    []

    
  return {
    addresses,
    allLootBoxAwards
  }
}
