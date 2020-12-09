import { batch, contract } from '@pooltogether/etherplex'

import LootBoxControllerAbi from '@pooltogether/loot-box/abis/LootBoxController'

const debug = require('debug')('pool-app:fetchLootBoxData')

export const fetchLootBoxData = async (
  provider,
  lootBoxControllerAddress,
  lootBoxAddress,
  tokenId,
) => {
  try {
    const etherplexLootBoxControllerContract = contract(
      'lootBoxController',
      LootBoxControllerAbi,
      lootBoxControllerAddress
    )

    const values = await batch(
      provider,
      etherplexLootBoxControllerContract
        .computeAddress(lootBoxAddress, tokenId)
    )

    return {
      computedLootBoxAddress: values?.lootBoxController?.computeAddress?.[0],
      loading: false
    }
  } catch (e) {
    console.error(e)
    throw {
      name: 'fetchLootBoxData Error',
      message: `Error from Infura was: ${e.message}`
    }
  }
}
