import { useContext } from 'react'

import { PT_LOOT_BOX_NAME } from 'lib/constants'
import { usePools } from 'lib/hooks/usePools'
import { useGraphLootBoxQuery } from 'lib/hooks/useGraphLootBoxQuery'
import { useLootBoxAwards } from 'lib/hooks/useLootBoxAwards'
import { getCurrentLootBox } from 'lib/services/getCurrentLootBox'

const _previousLootBox = (pool) => {
  let erc721Awards = pool?.compiledExternalErc721Awards || {}
  erc721Awards = Object.keys(erc721Awards)
    .map(key => erc721Awards[key])

  const awardedLootBox = erc721Awards?.find(award => award.name === PT_LOOT_BOX_NAME)

  const lootBoxAddress = awardedLootBox?.address
  const tokenId = awardedLootBox?.tokenIds?.[0]

  return { lootBoxAddress, tokenId }
}

export const useLootBox = function (historical, pool, blockNumber) {
  const { chainId } = useContext(AuthControllerContext)
  
  let lootBox

  let lootBoxInfo = {}

  if (historical) {
    lootBoxInfo = _previousLootBox(pool)
  } else {
    lootBoxInfo = getCurrentLootBox(pool, chainId)
  }

  const { data: graphLootBoxData } = useGraphLootBoxQuery(
    lootBoxInfo?.lootBoxAddress,
    lootBoxInfo?.tokenId,
    blockNumber
  )
  lootBox = graphLootBoxData?.lootBoxes?.[0]

  const { awards } = useLootBoxAwards(lootBox, pool, blockNumber)

  return { lootBox, awards }
}
