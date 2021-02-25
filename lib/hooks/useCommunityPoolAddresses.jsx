import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { usePoolAddressesQuery } from 'lib/hooks/usePoolAddressesQuery'

export function useCommunityPoolAddresses() {
  const { contractAddresses } = useContractAddresses()

  const { data: addresses, isFetched } = usePoolAddressesQuery()

  const governedPoolAddresses = contractAddresses.pools

  let communityPoolAddresses = []
  if (isFetched) {
    communityPoolAddresses = addresses?.filter(address => !governedPoolAddresses.includes(address))
  }

  return { communityPoolAddresses }
}
