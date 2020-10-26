export const getExternalAwardsDataFromQueryResult = (addresses, data) => {
  let poolData = {
    daiPool: {},
  }

  if (addresses && data?.externalErc20Awards?.length > 0 || data?.externalErc721Awards?.length > 0) {
    const externalErc20Awards = data.externalErc20Awards.find(externalErc20Award => externalErc20Award.id === `${addresses.daiPrizeStrategy}-${externalErc20Award.address}`)
    const externalErc721Awards = data.externalErc721Awards.find(externalErc721Award => externalErc721Award.id === `${addresses.daiPrizeStrategy}-${externalErc721Award.address}`)

    poolData.daiPool = { externalErc20Awards, externalErc721Awards }
  }

  return poolData
}
