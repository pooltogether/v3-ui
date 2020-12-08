import { useContext } from 'react'
import { useQuery } from 'react-query'
import { ethers } from 'ethers'

import {
  CONTRACT_ADDRESSES,
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS,
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getCurrentLootBox } from 'lib/services/getCurrentLootBox'
import { fetchExternalLootBoxData } from 'lib/utils/fetchExternalLootBoxData'

export function useEthereumLootBoxQuery(pool) {
  const { chainId, pauseQueries, provider } = useContext(AuthControllerContext)

  const lootBoxControllerAddress = CONTRACT_ADDRESSES[chainId]?.LootBoxController

  let { lootBoxAddress, tokenId } = getCurrentLootBox(pool, chainId)

  tokenId = ethers.utils.bigNumberify(tokenId)

  const enabled = !pauseQueries &&
    chainId &&
    Boolean(lootBoxControllerAddress) &&
    Boolean(tokenId)

  return useQuery(
    [QUERY_KEYS.ethereumLootBoxQuery, chainId, lootBoxControllerAddress, lootBoxAddress, tokenId.toString(), -1],
    async () => await fetchExternalLootBoxData(provider, lootBoxControllerAddress, lootBoxAddress, tokenId),
    {
      enabled,
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}
