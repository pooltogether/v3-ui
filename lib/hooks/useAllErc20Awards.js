/**
 * Filters the external erc20 awards for awards that have an amount to be awarded
 * Returns external erc20 awards AND loot box erc20's.
 * Used for both historic and current prizes
 * @param {*} prize
 * @returns
 */
export const useAllErc20Awards = (prize) => {
  let awards = []

  if (prize.externalErc20Awards?.length > 0) {
    awards = [...prize.externalErc20Awards]
  }

  // Only on historic prizes
  if (prize.awardedExternalErc20Tokens?.length > 0) {
    awards = [...awards, ...prize.awardedExternalErc20Tokens]
  }

  if (prize?.lootBox?.id) {
    const lootBox = prize.lootBox
    if (lootBox.erc20Tokens?.length > 0) {
      awards = [...awards, ...lootBox.erc20Tokens]
    }
  }

  return awards.filter((erc20) => erc20.amountUnformatted && !erc20.amountUnformatted.isZero())
}
