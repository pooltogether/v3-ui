import { useContext } from 'react'

import { PT_LOOT_BOX_NAME } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useGraphLootBoxQuery } from 'lib/hooks/useGraphLootBoxQuery'
import { getCurrentLootBox } from 'lib/services/getCurrentLootBox'

export const useLootBox = function (historical, pool, blockNumber) {
  const { chainId } = useContext(AuthControllerContext)
  
  let lootBox,
    lootBoxAddress,
    tokenId

  if (historical) {
    let erc721Awards = pool?.compiledExternalErc721Awards || {}
    erc721Awards = Object.keys(erc721Awards)
      .map(key => erc721Awards[key])

    const awardedLootBox = erc721Awards?.find(award => award.name === PT_LOOT_BOX_NAME)

    lootBoxAddress = awardedLootBox?.address
    tokenId = awardedLootBox?.tokenIds?.[0]
  } else {
    const result = getCurrentLootBox(pool, chainId)

    lootBoxAddress = result.lootBoxAddress
    tokenId = result.tokenId

    console.log(result)
  }

  const { data: graphLootBoxData } = useGraphLootBoxQuery(lootBoxAddress, tokenId, blockNumber)
  lootBox = graphLootBoxData?.lootBoxes?.[0]

  console.log(graphLootBoxData)

  return { lootBox }
}
