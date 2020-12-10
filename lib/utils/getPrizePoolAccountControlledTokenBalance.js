export const getPrizePoolAccountControlledTokenBalance = (prizePoolAccount, address) => {
  const balances = prizePoolAccount?.account?.controlledTokenBalances

  return balances?.find(ctBalance => ctBalance.controlledToken.id === address)
}
