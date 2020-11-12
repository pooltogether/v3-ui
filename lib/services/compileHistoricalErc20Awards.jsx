import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

export const compileHistoricalErc20Awards = (graphPool, uniswapPriceData) => {
  const erc20GraphData = graphPool?.prizeStrategy?.externalErc20Awards

  if (
    isEmpty(erc20GraphData) ||
    isEmpty(uniswapPriceData)
  ) {
    return {}
  }

  let data = {}

  erc20GraphData.forEach(obj => {
    const priceData = uniswapPriceData[obj.address]

    const balanceFormatted = ethers.utils.formatUnits(obj.balanceAwarded, parseInt(obj.decimals, 10))
    const value = priceData?.usd && parseFloat(balanceFormatted) * priceData.usd

    data[obj.address] = {
      ...obj,
      ...priceData,
      value
    }
  })

  return data
}
