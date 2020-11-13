import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

import { HISTORICAL_TOKEN_VALUES } from 'lib/constants'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'

export const compileHistoricalErc20Awards = (graphPool, uniswapPriceData, prize) => {
  const prizeNumber = extractPrizeNumberFromPrize(prize)
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

    let priceUSD = HISTORICAL_TOKEN_VALUES['prizeNumber']?.[prizeNumber]?.[obj.address]
    if (!priceUSD) {
      priceUSD = priceData?.usd
    }

    const balanceAwardedBN = ethers.utils.bigNumberify(obj.balanceAwarded)
    const balanceFormatted = ethers.utils.formatUnits(obj.balanceAwarded, parseInt(obj.decimals, 10))

    const value = priceUSD && parseFloat(balanceFormatted) * priceUSD

    data[obj.address] = {
      ...obj,
      ...priceData,
      balanceAwardedBN,
      value
    }
  })

  return data
}
