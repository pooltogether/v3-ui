import { useGraphLootBoxQuery } from 'lib/hooks/useGraphLootBoxQuery'
import { useLootBoxAwards } from 'lib/hooks/useLootBoxAwards'
import { usePools } from 'lib/hooks/usePools'
import { getCurrentLootBox } from 'lib/services/getCurrentLootBox'

const _previousLootBox = (pool, lootBoxAddress) => {
  let erc721Awards = pool?.compiledExternalErc721Awards || {}
  erc721Awards = Object.keys(erc721Awards)
    .map(key => erc721Awards[key])

    console.log({ erc721Awards})
  const awardedLootBox = erc721Awards?.find(award => award.address === lootBoxAddress)
  console.log({ awardedLootBox})

  const tokenId = awardedLootBox?.tokenIds?.[0]

  return { lootBoxAddress, tokenId }
}

export const useLootBox = function (
  historical,
  pool,
  externalErcAwards,
  blockNumber
) {
  const { contractAddresses } = usePools()
  const lootBoxAddress = contractAddresses.lootBox

  let lootBox

  let lootBoxInfo = {}

  if (historical) {
    lootBoxInfo = _previousLootBox(pool, lootBoxAddress)
  } else {
    lootBoxInfo = getCurrentLootBox(pool, lootBoxAddress)
  }

  const {
    data: graphLootBoxData,
    isFetching: lootBoxIsFetching,
    isFetched: lootBoxIsFetched
  } = useGraphLootBoxQuery(
    lootBoxInfo?.lootBoxAddress,
    lootBoxInfo?.tokenId,
    blockNumber
  )
  lootBox = graphLootBoxData?.lootBoxes?.[0]

  const { awards } = useLootBoxAwards(lootBox, externalErcAwards, lootBoxAddress, blockNumber)

  return { lootBox, awards, lootBoxIsFetching, lootBoxIsFetched }
}
