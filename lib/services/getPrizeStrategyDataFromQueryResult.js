export const getPrizeStrategyDataFromQueryResult = (addresses, data) => {
  let prizeStrategyData = {
    daiPrizeStrategy: {},
    usdcPrizeStrategy: {},
    // usdtPrizeStrategy: {},
    // wbtcPrizeStrategy: {},
  }

  if (addresses && data && data.singleRandomWinners && data.singleRandomWinners.length > 0) {
    const dynamicDaiData = data.singleRandomWinners.find(srw => addresses.daiPrizeStrategy === srw.id)
    const dynamicUsdcData = data.singleRandomWinners.find(srw => addresses.usdcPrizeStrategy === srw.id)
    // const dynamicUsdtData = data.singleRandomWinners.find(srw => addresses.usdtPrizeStrategy === srw.id)
    // const dynamicWbtcData = data.singleRandomWinners.find(srw => addresses.wbtcPrizeStrategy === srw.id)

    prizeStrategyData.daiPrizeStrategy = { prizeStrategyAddress: addresses.daiPrizeStrategy, ...prizeStrategyData.daiPrizeStrategy, ...dynamicDaiData }
    prizeStrategyData.usdcPrizeStrategy = { prizeStrategyAddress: addresses.usdcPrizeStrategy, ...prizeStrategyData.usdcPrizeStrategy, ...dynamicUsdcData }
    // prizeStrategyData.usdtPrizeStrategy = { prizeStrategyAddress: addresses.usdtPrizeStrategy, ...prizeStrategyData.usdtPrizeStrategy, ...dynamicUsdtData }
    // prizeStrategyData.wbtcPrizeStrategy = { prizeStrategyAddress: addresses.wbtcPrizeStrategy, ...prizeStrategyData.wbtcPrizeStrategy, ...dynamicWbtcData }
  }

  return prizeStrategyData
}
