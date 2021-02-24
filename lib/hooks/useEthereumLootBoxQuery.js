import { useContext } from 'react'
import { useQuery } from 'react-query'
import { ethers } from 'ethers'
import { isEmpty } from 'lodash'

import { MAINNET_POLLING_INTERVAL, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { fetchLootBoxComputedAddressData } from 'lib/utils/fetchLootBoxComputedAddressData'

export function useEthereumLootBoxQuery(tokenId, blockNumber = -1) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { readProvider } = useReadProvider()

  const { contractAddresses } = useContractAddresses()

  const lootBoxControllerAddress = contractAddresses?.lootBoxController
  const lootBoxAddress = contractAddresses?.lootBox

  if (Boolean(tokenId)) {
    tokenId = ethers.utils.bigNumberify(tokenId)
  }

  const enabled =
    Boolean(!pauseQueries) &&
    Boolean(chainId) &&
    !isEmpty(readProvider) &&
    Boolean(lootBoxControllerAddress) &&
    Boolean(tokenId)

  return useQuery(
    [
      QUERY_KEYS.ethereumLootBoxQuery,
      chainId,
      lootBoxControllerAddress,
      lootBoxAddress,
      tokenId?.toString(),
      blockNumber,
    ],
    async () =>
      await fetchLootBoxComputedAddressData(
        readProvider,
        lootBoxControllerAddress,
        lootBoxAddress,
        tokenId
      ),
    {
      enabled,
      refetchInterval: MAINNET_POLLING_INTERVAL,
    }
  )
}
