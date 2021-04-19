import { useQuery } from 'react-query'

import { CONTRACT_ADDRESSES } from 'lib/constants/contracts'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useChainId } from 'lib/hooks/useChainId'

import { batch, contract } from '@pooltogether/etherplex'
import LootBoxControllerAbi from '@pooltogether/loot-box/abis/LootBoxController'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { getLootBoxBatchName } from 'lib/utils/poolDataUtils'

export const useLootBoxComputedAddresses = (tokenIds) => {
  const chainId = useChainId()
  const { readProvider } = useReadProvider()
  return useQuery([QUERY_KEYS.lootBoxComputedAddresses], () =>
    getLootBoxComputedAddresses(chainId, readProvider, tokenIds)
  )
}

const getLootBoxComputedAddresses = async (chainId, readProvider, tokenIds) => {
  const lootBoxAddress = CONTRACT_ADDRESSES[chainId]?.lootBox?.toLowerCase()
  const lootBoxControllerAddress = CONTRACT_ADDRESSES[chainId]?.lootBoxController?.toLowerCase()

  const batchCalls = []
  tokenIds.forEach((tokenId) => {
    const lootBoxControllerContract = contract(
      getLootBoxBatchName(lootBoxAddress, tokenId),
      LootBoxControllerAbi,
      lootBoxControllerAddress
    )
    batchCalls.push(lootBoxControllerContract.computeAddress(lootBoxAddress, tokenId))
  })

  const response = await batch(readProvider, ...batchCalls)
  console.log(response)
}
