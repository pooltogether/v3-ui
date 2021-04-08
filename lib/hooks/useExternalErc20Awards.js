/**
 * Filters the external erc20 awards for awards that have an amount to be awarded
 * @param {*} pool
 * @returns
 */
export const useExternalErc20Awards = (pool) => {
  let awards = []
  if (pool.prize.externalErc20Awards?.length > 0) {
    awards = [...pool.prize.externalErc20Awards]
  }

  if (pool.prize.lootBoxes) {
    pool.prize.lootBoxes.forEach((lootBox) => {
      if (lootBox.erc20Tokens?.length > 0) {
        awards = [...awards, ...lootBox.erc20Tokens]
      }
    })
  }

  return awards.filter((erc20) => erc20.amountUnformatted && !erc20.amountUnformatted.isZero())
}
