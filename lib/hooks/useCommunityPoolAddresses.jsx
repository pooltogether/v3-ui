import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { usePoolAddressesQuery } from 'lib/hooks/usePoolAddressesQuery'

const COMMUNITY_POOLS_BLOCK_LIST = [
  '0xfb99ac6fdd87bc749dc32d772624c06c50b28a34',
  '0xcc75e748342fa103099cf32c09ebda39b4556f61',
  '0x9bdd57c278794bdced35f091bb26736a4cf4aaa6',
  '0x8932f3e02bdd4caa61bdc7be0a80dd2911a78071',
  '0x22964f820d40f22f59bf4a7f06aa8f27b159e398',
  '0x908d0f3bcdb4ece202f49bfd5037e1bdb4d57fd2'
]

export function useCommunityPoolAddresses() {
  const { contractAddresses } = useContractAddresses()

  const { data: addresses, isFetched } = usePoolAddressesQuery()

  const governedPoolAddresses = contractAddresses.pools

  let communityPoolAddresses = []
  if (isFetched) {
    communityPoolAddresses = addresses
      ?.filter(address => !governedPoolAddresses.includes(address))
      .filter(address => !COMMUNITY_POOLS_BLOCK_LIST.includes(address))
  }

  return { communityPoolAddresses }
}
