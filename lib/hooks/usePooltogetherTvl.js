import { ethers } from 'ethers'
import { useAllPools } from 'lib/hooks/usePools'

export const usePooltogetherTotalPrizes = () => {
  const { isFetched, data } = useAllPools()
  if (!isFetched || !data) return null
  return calculateTotalPrizes(data)
}

export const usePooltogetherTvl = () => {
  const { isFetched, data } = useAllPools()
  if (!isFetched || !data) return null
  return calculateTotalValueLocked(data)
}

const calculateTotalValueLocked = (pools) =>
  ethers.utils.formatUnits(
    pools.reduce((total, pool) => {
      if (pool.prizePool.totalValueLockedUsdScaled) {
        return total.add(pool.prizePool.totalValueLockedUsdScaled)
      }
      return total
    }, ethers.constants.Zero),
    2
  )

const calculateTotalPrizes = (pools) =>
  ethers.utils.formatUnits(
    pools.reduce((total, pool) => {
      if (pool.prize.totalValueUsd) {
        return total.add(pool.prize.totalValueUsdScaled)
      }
      return total
    }, ethers.constants.Zero),
    2
  )
