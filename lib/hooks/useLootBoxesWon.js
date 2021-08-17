import { CONTRACT_ADDRESSES } from 'lib/constants/contracts'
import { useAllUsersPrizes } from 'lib/hooks/useAllUsersPrizes'
import { useAllPoolContracts } from 'lib/hooks/usePoolContracts'

/**
 * Returns all loot boxes won by the user, filtered by the pools supported on the flagship app
 * @returns
 */
export const useLootBoxesWon = (usersAddress) => {
  const poolContracts = useAllPoolContracts()
  const { data: prizes, ...prizesUseQueryResponse } = useAllUsersPrizes(usersAddress)

  // Filter lootboxes by flagship supported pools
  const lootBoxes = prizes
    ?.map((prize) => {
      if (!prize) return null
      const lootBoxAddress = CONTRACT_ADDRESSES[prize.chainId]?.lootBox?.toLowerCase()
      if (!lootBoxAddress) return null
      return (
        prize?.awardedExternalErc721Nfts
          ?.filter((_awardedNft) => _awardedNft.address === lootBoxAddress)
          ?.filter((_awardedNft) =>
            Boolean(
              poolContracts.find(
                (contract) => contract.prizePool.address === _awardedNft.prize.prizePool.id
              )
            )
          ) || []
      )
    })
    .flat()
    .filter(Boolean)

  return {
    ...prizesUseQueryResponse,
    data: lootBoxes
  }
}
