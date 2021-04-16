import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { CONTRACT_ADDRESSES } from 'lib/constants/contracts'
import { useChainId } from 'lib/hooks/useChainId'
import { useLootBoxComputedAddresses } from 'lib/hooks/useLootBoxComputedAddress'
import { useMultiversionPlayerPrizes } from 'lib/hooks/useMultiversionPlayerPrizes'
import { usePoolContracts } from 'lib/hooks/usePoolContracts'
import { useContext } from 'react'

/**
 * Returns all loot boxes won by the user, filtered by the pools supported on the flagship app
 * @returns
 */
export const useLootBoxesWon = () => {
  const chainId = useChainId()
  const poolContracts = usePoolContracts()
  const { usersAddress } = useContext(AuthControllerContext)
  const { data: prizes } = useMultiversionPlayerPrizes(usersAddress)
  const lootBoxAddress = CONTRACT_ADDRESSES[chainId]?.lootBox?.toLowerCase()
  const erc721sWon =
    prizes?.awardedExternalErc721Nfts
      ?.filter((_awardedNft) => _awardedNft.address === lootBoxAddress)
      ?.filter((_awardedNft) =>
        Boolean(
          poolContracts.find(
            (contract) => contract.prizePool.address === _awardedNft.prize.prizePool.id
          )
        )
      ) || []

  if (!lootBoxAddress || erc721sWon.length === 0) {
    return []
  }
  return erc721sWon
}
