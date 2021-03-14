import { ethers } from 'ethers'

import { DEFAULT_TOKEN_PRECISION, SECONDS_PER_DAY } from 'lib/constants'
import { useTokenFaucetDripRate } from 'lib/hooks/useTokenFaucetDripRate'
import { usePoolTokenUSD } from 'lib/hooks/usePoolTokenUSD'

const BLOCK_LIST = ['0xd80a1416eD5139B6695d5A5cb07e99832A045f3A']

export const useTokenFaucetAPY = (pool) => {
  let apy
  const tokenFaucetAddress = pool.tokenListener

  const { data } = useTokenFaucetDripRate(tokenFaucetAddress)
  const { dripRatePerSecond } = data || {}

  const poolTokenUSD = usePoolTokenUSD()

  if (BLOCK_LIST.includes(tokenFaucetAddress)) {
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
