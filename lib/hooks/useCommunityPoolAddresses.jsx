import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { usePoolAddressesQuery } from 'lib/hooks/usePoolAddressesQuery'

const COMMUNITY_POOLS_BLOCK_LIST = [
  '0xfb99ac6fdd87bc749dc32d772624c06c50b28a34',
  '0xcc75e748342fa103099cf32c09ebda39b4556f61',
  '0x9bdd57c278794bdced35f091bb26736a4cf4aaa6',
  '0x8932f3e02bdd4caa61bdc7be0a80dd2911a78071',
  '0x22964f820d40f22f59bf4a7f06aa8f27b159e398',
  '0x908d0f3bcdb4ece202f49bfd5037e1bdb4d57fd2',
  '0x0725ca260292d3c3911d7b67d525682ec861339b',
  '0x1ee6194b0e28c12df0fd107e5eb883aa071f8c9a',

  // We may not want to remove some of these if they're still active:
  '0x258d1ab585593831f2dcc898722fb924fc0e3609',
  '0x3dd1749e00b6376779c5e63a38f7b5bbbd7ce3f2',
  '0x440a0622f124e4fd9925dac51b3bf1907e95f55b',
  '0x4b33763af4886278bfdf870dd7ea4838620bc7e9',
  '0x53de5a70527c0117c81319db4a05967f469a32f0',
  '0x4b912b18a94a1640c4230f9444c3871a6f4f9d5e',
  '0x7339b77606b96bd743f7c4646e51b024e47d7eff',
  '0x8f961526bc2fb2a55287522e728a7717d78ecc19',
  '0xb2153afa4b1bf7bfd89a3c94df5acc13d93558f7',
  '0xcc6f8a4b3f04c688ea8681eb5ba33a5bc2f9df21',
  '0x3e2e88f6eaa189e397bf87153e085a757028c069'
]

export function useCommunityPoolAddresses() {
  const { contractAddresses } = useContractAddresses()

  const { data: addresses, isFetched } = usePoolAddressesQuery()

  const governedPoolAddresses = contractAddresses?.pools

  let communityPoolAddresses = []
  if (isFetched) {
    communityPoolAddresses = addresses
      ?.filter(address => !governedPoolAddresses.includes(address))
      .filter(address => !COMMUNITY_POOLS_BLOCK_LIST.includes(address))
  }

  return { communityPoolAddresses }
}
