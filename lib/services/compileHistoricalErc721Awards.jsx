import { isEmpty } from 'lodash'

export const compileHistoricalErc721Awards = (ethereumErc721Awards, prize) => {
  const erc721GraphData = prize?.awardedExternalErc721Nfts

  if (
    isEmpty(erc721GraphData) ||
    isEmpty(ethereumErc721Awards)
  ) {
    return {}
  }

  let data = {}

  erc721GraphData.forEach(obj => {
    // const value = priceUSD && parseFloat(balanceFormatted) * priceUSD
    const ethereumErc721Token = ethereumErc721Awards[obj.address]

    data[obj.address] = {
      ...ethereumErc721Token,
      ...obj,
    }
  })

  return data
}
