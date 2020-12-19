import { useContext } from 'react'
import { useQuery } from 'react-query'
import { ethers } from 'ethers'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS,
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePools } from 'lib/hooks/usePools'
import { getCurrentLootBox } from 'lib/services/getCurrentLootBox'
import { fetchLootBoxData } from 'lib/utils/fetchLootBoxData'

export function useEthereumLootBoxQuery(pool) {
  const { chainId, pauseQueries, provider } = useContext(AuthControllerContext)

  const { contractAddresses } = usePools()

  const lootBoxControllerAddress = contractAddresses.lootBoxController
  const lootBoxAddress = contractAddresses.lootBox

  let { tokenId } = getCurrentLootBox(pool, lootBoxAddress)

  if (Boolean(tokenId)) {
    tokenId = ethers.utils.bigNumberify(tokenId)
  }


  const enabled = Boolean(!pauseQueries) &&
    Boolean(chainId) &&
    Boolean(lootBoxControllerAddress) &&
    Boolean(tokenId)

  return useQuery(
    [QUERY_KEYS.ethereumLootBoxQuery, chainId, lootBoxControllerAddress, lootBoxAddress, tokenId?.toString(), -1],
    async () => await fetchLootBoxData(provider, lootBoxControllerAddress, lootBoxAddress, tokenId),
    {
      enabled,
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}
