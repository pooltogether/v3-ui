import { contractAddresses } from '@pooltogether/current-pool-data'

export const getContractAddresses = (chainId) => {
  let daiPoolAddress,
    usdcPoolAddress,
    usdtPoolAddress,
    // wbtcPoolAddress,
    // zrxPoolAddress,
    // batPoolAddress,
    daiPrizeStrategyAddress,
    usdcPrizeStrategyAddress,
    usdtPrizeStrategyAddress
    // wbtcPrizeStrategyAddress,
    // zrxPrizeStrategyAddress,
    // batPrizeStrategyAddress

  try {
    daiPoolAddress = contractAddresses[chainId].dai.prizePool
    usdcPoolAddress = contractAddresses[chainId].usdc.prizePool
    usdtPoolAddress = contractAddresses[chainId].usdt.prizePool
    // wbtcPoolAddress = contractAddresses[chainId].WBTC_POOL_CONTRACT_ADDRESS
    // zrxPoolAddress = contractAddresses[chainId].ZRX_POOL_CONTRACT_ADDRESS
    // batPoolAddress = contractAddresses[chainId].BAT_POOL_CONTRACT_ADDRESS

    daiPrizeStrategyAddress = contractAddresses[chainId].dai.prizeStrategy
    usdcPrizeStrategyAddress = contractAddresses[chainId].usdc.prizeStrategy
    usdtPrizeStrategyAddress = contractAddresses[chainId].usdt.prizeStrategy
    // wbtcPrizeStrategyAddress = contractAddresses[chainId].WBTC_PRIZE_STRATEGY_CONTRACT_ADDRESS
    // zrxPrizeStrategyAddress = contractAddresses[chainId].ZRX_PRIZE_STRATEGY_CONTRACT_ADDRESS
    // batPrizeStrategyAddress = contractAddresses[chainId].BAT_PRIZE_STRATEGY_CONTRACT_ADDRESS

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
    // wbtcPool: wbtcPoolAddress.toLowerCase(),
    // zrxPool: zrxPoolAddress.toLowerCase(),
    // batPool: batPoolAddress.toLowerCase(),
    daiPrizeStrategy: daiPrizeStrategyAddress.toLowerCase(),
    usdcPrizeStrategy: usdcPrizeStrategyAddress.toLowerCase(),
    usdtPrizeStrategy: usdtPrizeStrategyAddress.toLowerCase(),
    // wbtcPrizeStrategy: wbtcPrizeStrategyAddress.toLowerCase(),
    // zrxPrizeStrategy: zrxPrizeStrategyAddress.toLowerCase(),
    // batPrizeStrategy: batPrizeStrategyAddress.toLowerCase(),
  }
}
