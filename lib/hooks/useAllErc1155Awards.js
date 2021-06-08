/**
 * Filters the external erc1155 awards for awards that have an amount to be awarded
 * Returns external erc1155 awards AND loot box erc1155's
 * Used for both historic and current prizes
 * @param {*} prize
 * @returns
 */
export const useAllErc1155Awards = (prize) => {
  let awards = []
  if (prize.externalErc1155Awards?.length > 0) {
    awards = [...prize.externalErc1155Awards]
  }

  // Only on historic prizes
  if (prize.awardedExternalErc1155Tokens?.length > 0) {
    awards = [...awards, ...prize.awardedExternalErc1155Tokens]
  }

  if (prize?.lootBox?.id) {
    const lootBox = prize.lootBox
    if (lootBox.erc1155Tokens?.length > 0) {
      awards = [...awards, ...lootBox.erc1155Tokens]
    }
  }

  return awards
}
