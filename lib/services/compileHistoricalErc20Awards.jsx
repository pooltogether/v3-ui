import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

import { HISTORICAL_TOKEN_VALUES } from 'lib/constants'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'

// This is for past prizes / TimeTravelPool only
export const compileHistoricalErc20Awards = (prize, uniswapPriceData) => {
  const prizeNumber = extractPrizeNumberFromPrize(prize)
  const erc20GraphData = prize?.awardedExternalErc20Tokens

  const data = []

  if (
    isEmpty(erc20GraphData) ||
    isEmpty(uniswapPriceData)
  ) {
    return data
  }

  erc20GraphData.forEach(obj => {
    const priceData = uniswapPriceData[obj.address]

    let priceUSD = HISTORICAL_TOKEN_VALUES['prizeNumber']?.[prizeNumber]?.[obj.address]
    if (!priceUSD) {
      priceUSD = priceData?.usd
    }

    const balance = obj.balanceAwarded
    const balanceBN = ethers.utils.bigNumberify(obj.balanceAwarded)
    const balanceFormatted = ethers.utils.formatUnits(
      obj.balanceAwarded,
      parseInt(obj.decimals, 10)
    )

    const value = priceUSD && parseFloat(balanceFormatted) * priceUSD

    data.push({
      ...obj,
      ...priceData,
      balance,
      balanceBN,
      balanceFormatted,
      value
    })
  })

  return data
}
