import { contractAddresses } from '@pooltogether/current-pool-data'

import { CONTRACT_ADDRESSES } from 'lib/constants'

export const getContractAddresses = (chainId) => {
  let daiPoolAddress,
    usdcPoolAddress,
    // usdtPoolAddress,
    // wbtcPoolAddress,
    // zrxPoolAddress,
    // batPoolAddress,
    daiPrizeStrategyAddress,
    // usdcPrizeStrategyAddress
    // usdtPrizeStrategyAddress
    // wbtcPrizeStrategyAddress,
    // zrxPrizeStrategyAddress,
    // batPrizeStrategyAddress,
    daiPermitContract

  try {
    daiPoolAddress = contractAddresses[chainId].dai.prizePool
    // usdcPoolAddress = contractAddresses[chainId].usdc.prizePool
    // usdtPoolAddress = contractAddresses[chainId].usdt.prizePool
    // wbtcPoolAddress = contractAddresses[chainId].WBTC_POOL_CONTRACT_ADDRESS
    // zrxPoolAddress = contractAddresses[chainId].ZRX_POOL_CONTRACT_ADDRESS
    // batPoolAddress = contractAddresses[chainId].BAT_POOL_CONTRACT_ADDRESS

    daiPrizeStrategyAddress = contractAddresses[chainId].dai.prizeStrategy
    // usdcPrizeStrategyAddress = contractAddresses[chainId].usdc.prizeStrategy
    // usdtPrizeStrategyAddress = contractAddresses[chainId].usdt.prizeStrategy
    // wbtcPrizeStrategyAddress = contractAddresses[chainId].WBTC_PRIZE_STRATEGY_CONTRACT_ADDRESS
    // zrxPrizeStrategyAddress = contractAddresses[chainId].ZRX_PRIZE_STRATEGY_CONTRACT_ADDRESS
    // batPrizeStrategyAddress = contractAddresses[chainId].BAT_PRIZE_STRATEGY_CONTRACT_ADDRESS

    // daiPermitContract = CONTRACT_ADDRESSES[chainId].PermitAndDepositDai

    if (!daiPoolAddress) {
      throw new Error(`Unable to find DAI prize pool contract for chainId: ${chainId}`)
    }
  } catch (e) {
    throw e
  }

  return {
    daiPool: daiPoolAddress.toLowerCase(),
    // usdcPool: usdcPoolAddress.toLowerCase(),
    // usdtPool: usdtPoolAddress.toLowerCase(),
    // wbtcPool: wbtcPoolAddress.toLowerCase(),
    // zrxPool: zrxPoolAddress.toLowerCase(),
    // batPool: batPoolAddress.toLowerCase(),
    daiPrizeStrategy: daiPrizeStrategyAddress.toLowerCase(),
    // usdcPrizeStrategy: usdcPrizeStrategyAddress.toLowerCase(),
    // usdtPrizeStrategy: usdtPrizeStrategyAddress.toLowerCase(),
    // wbtcPrizeStrategy: wbtcPrizeStrategyAddress.toLowerCase(),
    // zrxPrizeStrategy: zrxPrizeStrategyAddress.toLowerCase(),
    // batPrizeStrategy: batPrizeStrategyAddress.toLowerCase(),
    daiPermitContract: daiPermitContract?.toLowerCase(),
    'v2DAIPool': '0x29fe7D60DdF151E5b52e5FAB4f1325da6b2bD958'.toLowerCase(),
    'v2USDCPool': '0x0034Ea9808E620A0EF79261c51AF20614B742B24'.toLowerCase(),
    'v2DAIPod': '0x9F4C5D8d9BE360DF36E67F52aE55C1B137B4d0C4'.toLowerCase(),
    'v2USDCPod': '0x6F5587E191C8b222F634C78111F97c4851663ba4'.toLowerCase(),
    'v2PoolDAIToken': '0x49d716DFe60b37379010A75329ae09428f17118d'.toLowerCase(),
    'v2PoolUSDCToken': '0xBD87447F48ad729C5c4b8bcb503e1395F62e8B98'.toLowerCase(),
  }
}
