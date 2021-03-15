import { ethers } from 'ethers'

import { DEFAULT_TOKEN_PRECISION, SECONDS_PER_DAY } from 'lib/constants'
import { useTokenFaucetData } from 'lib/hooks/useTokenFaucetData'
import { usePoolTokenUSD } from 'lib/hooks/usePoolTokenUSD'

export const useTokenFaucetAPY = (pool) => {
  let apy
  const tokenFaucetAddress = pool.tokenListener

  const { data } = useTokenFaucetData(tokenFaucetAddress)
  const { dripRatePerSecond, balanceOf } = data || {}

  const poolTokenUSD = usePoolTokenUSD()

  if (balanceOf?.eq(0)) {
    return
  }

  if (pool && poolTokenUSD && dripRatePerSecond) {
    const dripRatePerSecondNumber = dripRatePerSecond
      ? Number(ethers.utils.formatUnits(dripRatePerSecond, DEFAULT_TOKEN_PRECISION))
      : 0
    const totalDripPerDay = dripRatePerSecondNumber * SECONDS_PER_DAY
    const totalSupplyUSD = pool.totalDepositedUSD

    // (Daily distribution rate * price / pool AUM) * 365
    apy = ((totalDripPerDay * poolTokenUSD) / totalSupplyUSD) * 365 * 100
  }

  return apy
}
