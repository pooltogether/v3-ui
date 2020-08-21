export const getPoolDataFromQueryResult = (addresses, data) => {
  let poolData = {
    daiPool: {},
    usdcPool: {},
    // usdtPool: {},
    // wbtcPool: {},
  }

  if (addresses && data && data.prizePools && data.prizePools.length > 0) {
    const dynamicDaiData = data.prizePools.find(prizePool => addresses.daiPool === prizePool.id)
    const dynamicUsdcData = data.prizePools.find(prizePool => addresses.usdcPool === prizePool.id)
    // const dynamicUsdtData = data.prizePools.find(prizePool => addresses.usdtPool === prizePool.id)
    // const dynamicWbtcData = data.prizePools.find(prizePool => addresses.wbtcPool === prizePool.id)

    poolData.daiPool = { poolAddress: addresses.daiPool, ...poolData.daiPool, ...dynamicDaiData }
    poolData.usdcPool = { poolAddress: addresses.usdcPool, ...poolData.usdcPool, ...dynamicUsdcData }
    // poolData.usdtPool = { poolAddress: addresses.usdtPool, ...poolData.usdtPool, ...dynamicUsdtData }
    // poolData.wbtcPool = { poolAddress: addresses.wbtcPool, ...poolData.wbtcPool, ...dynamicWbtcData }
  }

  return poolData
}
