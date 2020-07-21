export const getPoolDataFromQueryResult = (addresses, data) => {
  let poolData = {
    daiPool: {},
    usdcPool: {},
    usdtPool: {},
  }

  if (addresses && data && data.prizePools && data.prizePools.length > 0) {
    const dynamicDaiData = data.prizePools.find(prizePool => addresses.daiPool === prizePool.id)
    const dynamicUsdcData = data.prizePools.find(prizePool => addresses.usdcPool === prizePool.id)
    const dynamicUsdtData = data.prizePools.find(prizePool => addresses.usdtPool === prizePool.id)

    poolData.daiPool = { ...poolData.daiPool, ...dynamicDaiData }
    poolData.usdcPool = { ...poolData.usdcPool, ...dynamicUsdcData }
    poolData.usdtPool = { ...poolData.usdtPool, ...dynamicUsdtData }
  }

  return poolData
}
