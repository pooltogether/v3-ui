import { useEthereumLootBoxQuery } from 'lib/hooks/useEthereumLootBoxQuery'
import { useGraphLootBoxQuery } from 'lib/hooks/useGraphLootBoxQuery'
import { useLootBoxAwards } from 'lib/hooks/useLootBoxAwards'
import { usePools } from 'lib/hooks/usePools'
import { getCurrentLootBox } from 'lib/services/getCurrentLootBox'
import { getPreviousLootBox } from 'lib/services/getPreviousLootBox'

export const useLootBox = function (externalErcAwards, blockNumber) {
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
  const tokenId = lootBoxInfo?.tokenId

  const { data, error, isFetching, isFetched } = useEthereumLootBoxQuery(tokenId)
  if (error) {
    console.error(error)
  }
  const { computedLootBoxAddress } = data || {}

  const {
    data: graphLootBoxData,
    isFetching: lootBoxIsFetching,
    isFetched: lootBoxIsFetched,
  } = useGraphLootBoxQuery(lootBoxContractAddress, tokenId, blockNumber)
  lootBox = graphLootBoxData?.lootBoxes?.[0]

  // "awards" is external (top-level) and lootbox awards compiled and smashed together
  // "lootBoxAwards" is only the erc721 lootbox's awards
  const { awards, lootBoxAwards } = useLootBoxAwards(lootBox, externalErcAwards, blockNumber)

  if (!contractAddresses) {
    return { lootBox: null, awards: {}, lootBoxAwards: [] }
  }

  return {
    tokenId,
    computedLootBoxAddress,
    lootBoxAwards,
    awards,
    lootBoxIsFetching,
    lootBoxIsFetched,
  }
}
