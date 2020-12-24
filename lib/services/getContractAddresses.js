import { contractAddresses } from '@pooltogether/current-pool-data'

export const getContractAddresses = (chainId) => {
  let daiPoolAddress,
    batPoolAddress,
    uniPoolAddress,
    lootBox,
    lootBoxController

  batPoolAddress = contractAddresses[chainId].bat?.prizePool?.toLowerCase()
  daiPoolAddress = contractAddresses[chainId].dai?.prizePool?.toLowerCase()
  uniPoolAddress = contractAddresses[chainId].uni?.prizePool?.toLowerCase()

  lootBox = contractAddresses[chainId].lootBox?.toLowerCase()
  lootBoxController = contractAddresses[chainId].lootBoxController?.toLowerCase()

  const pools = [
    daiPoolAddress,
    batPoolAddress,
    uniPoolAddress
  ].filter(pool => pool !== undefined)

  return {
    pools,
    'PT-cDAI': daiPoolAddress,
    'PT-cBAT': batPoolAddress,
    'PT-cUNI': uniPoolAddress,
    lootBox: lootBox,
    lootBoxController: lootBoxController,
    'v2DAIPool': '0x29fe7D60DdF151E5b52e5FAB4f1325da6b2bD958'.toLowerCase(),
    'v2USDCPool': '0x0034Ea9808E620A0EF79261c51AF20614B742B24'.toLowerCase(),
    'v2DAIPod': '0x9F4C5D8d9BE360DF36E67F52aE55C1B137B4d0C4'.toLowerCase(),
    'v2USDCPod': '0x6F5587E191C8b222F634C78111F97c4851663ba4'.toLowerCase(),
    'v2PoolDAIToken': '0x49d716DFe60b37379010A75329ae09428f17118d'.toLowerCase(),
    'v2PoolUSDCToken': '0xBD87447F48ad729C5c4b8bcb503e1395F62e8B98'.toLowerCase(),
    'v2MigrationContractAddress': '0x801b4872a635dccc7e679eeaf04bef08e562972a'.toLowerCase(),
  }
}
