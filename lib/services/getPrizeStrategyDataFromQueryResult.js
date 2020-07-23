export const getPrizeStrategyDataFromQueryResult = (addresses, data) => {
  let prizeStrategyData = {
    daiPrizeStrategy: {},
    usdcPrizeStrategy: {},
    usdtPrizeStrategy: {},
  }

  if (addresses && data && data.prizeStrategies && data.prizeStrategies.length > 0) {
    const dynamicDaiData = data.prizeStrategies.find(prizePool => addresses.daiPrizeStrategy === prizePool.id)
    const dynamicUsdcData = data.prizeStrategies.find(prizePool => addresses.usdcPrizeStrategy === prizePool.id)
    const dynamicUsdtData = data.prizeStrategies.find(prizePool => addresses.usdtPrizeStrategy === prizePool.id)

    prizeStrategyData.daiPrizeStrategy = { ...prizeStrategyData.daiPrizeStrategy, ...dynamicDaiData }
    prizeStrategyData.usdcPrizeStrategy = { ...prizeStrategyData.usdcPrizeStrategy, ...dynamicUsdcData }
    prizeStrategyData.usdtPrizeStrategy = { ...prizeStrategyData.usdtPrizeStrategy, ...dynamicUsdtData }
  }

  return prizeStrategyData
}
