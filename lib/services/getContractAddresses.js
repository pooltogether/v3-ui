import {
  CONTRACT_ADDRESSES,
} from 'lib/constants'

export const getContractAddresses = (chainId) => {
  let daiPrizePoolAddress,
    usdcPrizePoolAddress,
    usdtPrizePoolAddress

  try {
    daiPrizePoolAddress = CONTRACT_ADDRESSES[chainId].DAI_PRIZE_POOL_CONTRACT_ADDRESS
    usdcPrizePoolAddress = CONTRACT_ADDRESSES[chainId].USDC_PRIZE_POOL_CONTRACT_ADDRESS
    usdtPrizePoolAddress = CONTRACT_ADDRESSES[chainId].USDT_PRIZE_POOL_CONTRACT_ADDRESS

    if (!daiPrizePoolAddress) {
      throw new Error(`Unable to find DAI prize pool contract for chainId: ${chainId}`)
    }
  } catch (e) {
    throw e
  }
  
  return {
    daiPrizePool: daiPrizePoolAddress.toLowerCase(),
    usdcPrizePool: usdcPrizePoolAddress.toLowerCase(),
    usdtPrizePool: usdtPrizePoolAddress.toLowerCase(),
  }
}
