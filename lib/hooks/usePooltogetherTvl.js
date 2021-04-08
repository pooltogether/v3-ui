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
  pools
    .reduce((total, pool) => {
      if (pool.prizePool.totalValueLockedUsdScaled) {
        return total.add(pool.prizePool.totalValueLockedUsdScaled)
      }
      return total
    }, ethers.constants.Zero)
    .div(100)
    .toString()

const calculateTotalPrizes = (pools) =>
  pools
    .reduce((total, pool) => {
      if (pool.prize.totalValueUsd) {
        return total.add(pool.prize.totalValueUsdScaled)
      }
      return total
    }, ethers.constants.Zero)
    .div(100)
    .toString()
