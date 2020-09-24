import {
  CONTRACT_ADDRESSES,
} from 'lib/constants'

export const getContractAddresses = (chainId) => {
  let daiPoolAddress,
    usdcPoolAddress,
    usdtPoolAddress,
    wbtcPoolAddress,
    zrxPoolAddress,
    batPoolAddress,
    daiPrizeStrategyAddress,
    usdcPrizeStrategyAddress,
    usdtPrizeStrategyAddress,
    wbtcPrizeStrategyAddress,
    zrxPrizeStrategyAddress,
    batPrizeStrategyAddress

  try {
    daiPoolAddress = CONTRACT_ADDRESSES[chainId].DAI_POOL_CONTRACT_ADDRESS
    usdcPoolAddress = CONTRACT_ADDRESSES[chainId].USDC_POOL_CONTRACT_ADDRESS
    usdtPoolAddress = CONTRACT_ADDRESSES[chainId].USDT_POOL_CONTRACT_ADDRESS
    wbtcPoolAddress = CONTRACT_ADDRESSES[chainId].WBTC_POOL_CONTRACT_ADDRESS
    zrxPoolAddress = CONTRACT_ADDRESSES[chainId].ZRX_POOL_CONTRACT_ADDRESS
    batPoolAddress = CONTRACT_ADDRESSES[chainId].BAT_POOL_CONTRACT_ADDRESS

    daiPrizeStrategyAddress = CONTRACT_ADDRESSES[chainId].DAI_PRIZE_STRATEGY_CONTRACT_ADDRESS
    usdcPrizeStrategyAddress = CONTRACT_ADDRESSES[chainId].USDC_PRIZE_STRATEGY_CONTRACT_ADDRESS
    usdtPrizeStrategyAddress = CONTRACT_ADDRESSES[chainId].USDT_PRIZE_STRATEGY_CONTRACT_ADDRESS
    wbtcPrizeStrategyAddress = CONTRACT_ADDRESSES[chainId].WBTC_PRIZE_STRATEGY_CONTRACT_ADDRESS
    zrxPrizeStrategyAddress = CONTRACT_ADDRESSES[chainId].ZRX_PRIZE_STRATEGY_CONTRACT_ADDRESS
    batPrizeStrategyAddress = CONTRACT_ADDRESSES[chainId].BAT_PRIZE_STRATEGY_CONTRACT_ADDRESS

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
    wbtcPool: wbtcPoolAddress.toLowerCase(),
    zrxPool: zrxPoolAddress.toLowerCase(),
    batPool: batPoolAddress.toLowerCase(),
    daiPrizeStrategy: daiPrizeStrategyAddress.toLowerCase(),
    usdcPrizeStrategy: usdcPrizeStrategyAddress.toLowerCase(),
    usdtPrizeStrategy: usdtPrizeStrategyAddress.toLowerCase(),
    wbtcPrizeStrategy: wbtcPrizeStrategyAddress.toLowerCase(),
    zrxPrizeStrategy: zrxPrizeStrategyAddress.toLowerCase(),
    batPrizeStrategy: batPrizeStrategyAddress.toLowerCase(),
  }
}
