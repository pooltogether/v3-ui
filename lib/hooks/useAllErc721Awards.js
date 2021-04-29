/**
 * Filters the external erc721 awards for awards that have an amount to be awarded
 * Returns external erc721 awards AND loot box erc721's.
 * Used for both historic and current prizes
 * @param {*} prize
 * @returns
 */
export const useAllErc721Awards = (prize) => {
  let awards = []
  if (prize.externalErc721Awards?.length > 0) {
    awards = [...prize.externalErc721Awards]
  }

  // Only on historic prizes
  if (prize.awardedExternalErc721Tokens?.length > 0) {
    awards = [...awards, ...prize.awardedExternalErc721Tokens]
  }

  if (prize?.lootBox?.id) {
    const lootBox = prize.lootBox
    if (lootBox.erc721Tokens?.length > 0) {
      awards = [...awards, ...lootBox.erc721Tokens]
    }
  }

  return awards
}
