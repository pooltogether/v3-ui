import {
  CONTRACT_ADDRESSES,
} from 'lib/constants'

export const getContractAddresses = (chainId) => {
  let daiPoolAddress,
    usdcPoolAddress,
    usdtPoolAddress

  try {
    daiPoolAddress = CONTRACT_ADDRESSES[chainId].DAI_POOL_CONTRACT_ADDRESS
    usdcPoolAddress = CONTRACT_ADDRESSES[chainId].USDC_POOL_CONTRACT_ADDRESS
    usdtPoolAddress = CONTRACT_ADDRESSES[chainId].USDT_POOL_CONTRACT_ADDRESS

    // if (!daiPrizePoolAddress) {
    //   throw new Error(`Unable to find DAI prize pool contract for chainId: ${chainId}`)
    // }
  } catch (e) {
    throw e
  }
  
  return {
    daiPool: daiPoolAddress.toLowerCase(),
    usdcPool: usdcPoolAddress.toLowerCase(),
    usdtPool: usdtPoolAddress.toLowerCase(),
  }
}
