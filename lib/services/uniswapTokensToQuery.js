export const uniswapTokensToQuery = (erc20Awards = {}) => {
  erc20Awards = Object.keys(erc20Awards)
    .map((key) => erc20Awards[key])
    .filter((award) => award.balanceBN.gt(0))

  const addresses = erc20Awards ? erc20Awards.map((award) => award.address) : []

  return { addresses }
}
