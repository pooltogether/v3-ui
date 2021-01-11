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

export function useEthereumLootBoxQuery(pool, blockNumber = -1) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { readProvider } = useReadProvider()

  const { contractAddresses } = usePools()

  const lootBoxControllerAddress = contractAddresses?.lootBoxController
  const lootBoxAddress = contractAddresses?.lootBox

  const externalErcAwards = {
    compiledExternalErc20Awards: pool.compiledExternalErc20Awards,
    compiledExternalErc721Awards: pool.compiledExternalErc721Awards,
  }
  let { tokenId } = getCurrentLootBox(externalErcAwards, lootBoxAddress)
  console.log(tokenId)

  if (Boolean(tokenId)) {
    tokenId = ethers.utils.bigNumberify(tokenId)
  }

  const enabled = Boolean(!pauseQueries) &&
    Boolean(chainId) &&
    !isEmpty(readProvider) &&
    Boolean(lootBoxControllerAddress) &&
    Boolean(tokenId)

  return useQuery(
    [QUERY_KEYS.ethereumLootBoxQuery, chainId, lootBoxControllerAddress, lootBoxAddress, tokenId?.toString(), blockNumber],
    async () => await fetchLootBoxData(readProvider, lootBoxControllerAddress, lootBoxAddress, tokenId),
    {
      enabled,
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}
