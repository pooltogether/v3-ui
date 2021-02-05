import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

// This is for past prizes / TimeTravelPool only
export const compileHistoricalErc20Awards = (prize, uniswapPriceData) => {
  const erc20GraphData = prize?.awardedExternalErc20Tokens

  const data = []

  if (isEmpty(erc20GraphData)) {
    return data
  }

  erc20GraphData.forEach((obj) => {
    const balance = obj.balanceAwarded
    const balanceBN = ethers.utils.bigNumberify(obj.balanceAwarded)
    const balanceFormatted = ethers.utils.formatUnits(
      obj.balanceAwarded,
      parseInt(obj.decimals, 10)
    )

    data.push({
      ...obj,
      balance,
      balanceBN,
      balanceFormatted,
    })
  })

  return data
}
