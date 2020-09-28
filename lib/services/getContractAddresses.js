import { contractAddresses } from '@pooltogether/current-pool-data'

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
    daiPoolAddress = contractAddresses[chainId].DAI_POOL_CONTRACT_ADDRESS
    usdcPoolAddress = contractAddresses[chainId].USDC_POOL_CONTRACT_ADDRESS
    usdtPoolAddress = contractAddresses[chainId].USDT_POOL_CONTRACT_ADDRESS
    wbtcPoolAddress = contractAddresses[chainId].WBTC_POOL_CONTRACT_ADDRESS
    zrxPoolAddress = contractAddresses[chainId].ZRX_POOL_CONTRACT_ADDRESS
    batPoolAddress = contractAddresses[chainId].BAT_POOL_CONTRACT_ADDRESS

    daiPrizeStrategyAddress = contractAddresses[chainId].DAI_PRIZE_STRATEGY_CONTRACT_ADDRESS
    usdcPrizeStrategyAddress = contractAddresses[chainId].USDC_PRIZE_STRATEGY_CONTRACT_ADDRESS
    usdtPrizeStrategyAddress = contractAddresses[chainId].USDT_PRIZE_STRATEGY_CONTRACT_ADDRESS
    wbtcPrizeStrategyAddress = contractAddresses[chainId].WBTC_PRIZE_STRATEGY_CONTRACT_ADDRESS
    zrxPrizeStrategyAddress = contractAddresses[chainId].ZRX_PRIZE_STRATEGY_CONTRACT_ADDRESS
    batPrizeStrategyAddress = contractAddresses[chainId].BAT_PRIZE_STRATEGY_CONTRACT_ADDRESS

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
