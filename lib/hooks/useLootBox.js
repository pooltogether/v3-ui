import { useGraphLootBoxQuery } from 'lib/hooks/useGraphLootBoxQuery'
import { useLootBoxAwards } from 'lib/hooks/useLootBoxAwards'
import { usePools } from 'lib/hooks/usePools'
import { getCurrentLootBox } from 'lib/services/getCurrentLootBox'
import { getPreviousLootBox } from 'lib/services/getPreviousLootBox'

export const useLootBox = function (
  pool,
  externalErcAwards,
  blockNumber
) {
  const { contractAddresses } = usePools()
  
  
  const lootBoxContractAddress = contractAddresses?.lootBox

  let lootBox

  let lootBoxInfo = {}

  const historical = blockNumber > -1

  if (historical) {
    lootBoxInfo = getPreviousLootBox(pool, lootBoxContractAddress)
  } else {
    lootBoxInfo = getCurrentLootBox(pool, lootBoxContractAddress)
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

  const { awards } = useLootBoxAwards(lootBox, externalErcAwards, lootBoxContractAddress, blockNumber)

  if (!contractAddresses) {
    return { lootBox: null, awards: {} }
  }

  return { lootBox, computedLootBoxAddress, awards, lootBoxIsFetching, lootBoxIsFetched }
}
