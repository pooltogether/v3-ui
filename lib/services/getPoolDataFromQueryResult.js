export const getPoolDataFromQueryResult = (addresses, data) => {
  let poolData = {
    daiPool: null,
  }

  if (addresses && data?.length > 0) {
    const dynamicDaiData = data.find(prizePool => addresses.daiPool === prizePool.id)

    poolData.daiPool = { poolAddress: addresses.daiPool, ...poolData.daiPool, ...dynamicDaiData }
    console.log(poolData.daiPool)
  }

  return poolData
}
