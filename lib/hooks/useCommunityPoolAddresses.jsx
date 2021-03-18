import { useContext } from 'react'

import { COMMUNITY_POOLS_BLOCK_LIST } from 'lib/constants/communityPoolsBlockList'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { usePoolAddressesQuery } from 'lib/hooks/usePoolAddressesQuery'

export function useCommunityPoolAddresses() {
  const { contractAddresses } = useContractAddresses()
  const { chainId } = useContext(AuthControllerContext)

  const { data: addresses, isFetched } = usePoolAddressesQuery()

  const governedPoolAddresses = contractAddresses?.pools

  let communityPoolAddresses = []
  if (isFetched) {
    communityPoolAddresses = addresses
      ?.filter((address) => !governedPoolAddresses.includes(address))
      .filter((address) => !COMMUNITY_POOLS_BLOCK_LIST[chainId].includes(address.toLowerCase()))
  }

  return { communityPoolAddresses }
}
