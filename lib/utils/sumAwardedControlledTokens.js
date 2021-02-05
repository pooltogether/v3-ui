import { ethers } from 'ethers'

import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

export function sumAwardedControlledTokens(awardedControlledTokens) {
  let cumulativeWinnings = ethers.utils.bigNumberify(0)

  awardedControlledTokens.forEach((awardedControlledToken) => {
    const decimals = parseInt(
      awardedControlledToken.prize.prizePool.underlyingCollateralDecimals,
      10
    )
    const winnings = normalizeTo18Decimals(awardedControlledToken.amount, decimals)

    cumulativeWinnings = cumulativeWinnings.add(winnings)
  })

  return cumulativeWinnings
}
