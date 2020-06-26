export const getPoolDataFromQueryResult = (addresses, data) => {
  let poolData = {
    daiPool: {},
    usdcPool: {},
    usdtPool: {},
  }

  if (data && data.prizePools && data.prizePools.length > 0) {
    const dynamicDaiData = data.prizePools.find(prizePool => addresses.daiPrizePool === prizePool.id)
    const dynamicUsdcData = data.prizePools.find(prizePool => addresses.usdcPrizePool === prizePool.id)
    const dynamicUsdtData = data.prizePools.find(prizePool => addresses.usdtPrizePool === prizePool.id)

    poolData.daiPool = { ...poolData.daiPool, ...dynamicDaiData }
    poolData.usdcPool = { ...poolData.usdcPool, ...dynamicUsdcData }
    poolData.usdtPool = { ...poolData.usdtPool, ...dynamicUsdtData }
  }

  return poolData
}
