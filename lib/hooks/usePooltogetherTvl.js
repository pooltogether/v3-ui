import { ethers } from 'ethers'
import { useAllPools } from 'lib/hooks/usePools'

export const usePooltogetherTvl = () => {
  const { isFetched, data } = useAllPools()
  if (!isFetched || !data) return null
  return calculateTotalValueLocked(data)
}

const calculateTotalValueLocked = (poolData) => {
  return poolData.reduce((total, pool) => {
    if (pool.prizePool.tvlUsd) {
      return total.add(Math.round(pool.prizePool.tvlUsd))
    }
    return total
  }, ethers.constants.Zero)
}
