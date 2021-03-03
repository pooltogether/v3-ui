import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

const bn = ethers.utils.bigNumberify

// This is for past prizes / TimeTravelPool only
export const compileHistoricalErc20Awards = (prize, numOfWinners, splitExternalErc20Awards) => {
  const erc20GraphData = prize?.awardedExternalErc20Tokens

  const data = []

  if (isEmpty(erc20GraphData)) {
    return data
  }

  erc20GraphData.forEach((obj) => {
    const balanceBN = splitExternalErc20Awards ? bn(obj.balanceAwarded).mul(numOfWinners) : bn(obj.balanceAwarded)
    const balanceAwarded = balanceBN.toString()
    const balanceFormatted = ethers.utils.formatUnits(
      balanceAwarded,
      parseInt(obj.decimals, 10)
    )

    data.push({
      ...obj,
      balance: balanceAwarded,
      balanceBN,
      balanceFormatted,
    })
  })

  return data
}
