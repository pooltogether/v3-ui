import { useContext } from 'react'
import { useQuery } from 'react-query'
import { ethers } from 'ethers'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS,
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePools } from 'lib/hooks/usePools'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { getCurrentLootBox } from 'lib/services/getCurrentLootBox'
import { fetchLootBoxData } from 'lib/utils/fetchLootBoxData'

export function useEthereumLootBoxQuery(pool) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { readProvider } = useReadProvider()

  const { contractAddresses } = usePools()

  const lootBoxControllerAddress = contractAddresses?.lootBoxController
  const lootBoxAddress = contractAddresses?.lootBox

  let { tokenId } = getCurrentLootBox(pool, lootBoxAddress)

  if (Boolean(tokenId)) {
    tokenId = ethers.utils.bigNumberify(tokenId)
  }

  const enabled = Boolean(!pauseQueries) &&
    Boolean(chainId) &&
    !isEmpty(readProvider) &&
    Boolean(lootBoxControllerAddress) &&
    Boolean(tokenId)

  return useQuery(
    [QUERY_KEYS.ethereumLootBoxQuery, chainId, lootBoxControllerAddress, lootBoxAddress, tokenId?.toString(), -1],
    async () => await fetchLootBoxData(readProvider, lootBoxControllerAddress, lootBoxAddress, tokenId),
    {
      enabled,
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}
