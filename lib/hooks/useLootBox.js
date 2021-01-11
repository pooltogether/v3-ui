import { useGraphLootBoxQuery } from 'lib/hooks/useGraphLootBoxQuery'
import { useLootBoxAwards } from 'lib/hooks/useLootBoxAwards'
import { usePools } from 'lib/hooks/usePools'
import { getCurrentLootBox } from 'lib/services/getCurrentLootBox'
import { getPreviousLootBox } from 'lib/services/getPreviousLootBox'

export const useLootBox = function (
  externalErcAwards,
  blockNumber
) {
  const { contractAddresses } = usePools()
  
  
  const lootBoxContractAddress = contractAddresses?.lootBox

  let lootBox

  let lootBoxInfo = {}

  const historical = blockNumber > -1

  if (historical) {
    lootBoxInfo = getPreviousLootBox(externalErcAwards, lootBoxContractAddress)
  } else {
    lootBoxInfo = getCurrentLootBox(externalErcAwards, lootBoxContractAddress)
  }

  const computedLootBoxAddress = lootBoxInfo?.lootBoxAddress

  const {
    data: graphLootBoxData,
    isFetching: lootBoxIsFetching,
    isFetched: lootBoxIsFetched
  } = useGraphLootBoxQuery(
    computedLootBoxAddress,
    lootBoxInfo?.tokenId,
    blockNumber
  )
  lootBox = graphLootBoxData?.lootBoxes?.[0]

  // this is all awards, external (top-level) and lootbox smashed together
  const { awards } = useLootBoxAwards(lootBox, externalErcAwards, lootBoxContractAddress, blockNumber)
  
  const lootBoxAwards = {
    erc20Balances: lootBox?.erc20Balances || [],
    erc721Tokens: lootBox?.erc721Tokens || [],
    erc1155Balances: lootBox?.erc1155Balances || []
  }

  if (!contractAddresses) {
    return { lootBox: null, awards: {} }
  }

  return { lootBox, computedLootBoxAddress, lootBoxAwards, awards, lootBoxIsFetching, lootBoxIsFetched }
}
