/**
 * Filters the external erc20 awards for awards that have an amount to be awarded
 * @param {*} pool
 * @returns
 */
export const useExternalErc20Awards = (pool) => {
  return [...pool.prize.externalErc20Awards, ...pool.prize.lootBoxes?.[0].erc20Tokens].filter(
    (erc20) => erc20.amountUnformatted && !erc20.amountUnformatted.isZero()
  )
}
