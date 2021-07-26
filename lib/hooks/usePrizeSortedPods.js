import { useAllPods } from 'lib/hooks/useAllPods'

export const usePrizeSortedPods = () => {
  const { data: pods, isFetched, ...remainder } = useAllPods()

  if (!isFetched) {
    return {
      data: pods,
      isFetched,
      ...remainder
    }
  }

  const flattenedPods = Object.values(pods).flat()
  const sortedPods = flattenedPods.sort(
    (a, b) => Number(b.prizePool.prize.totalValueUsd) - Number(a.prizePool.prize.totalValueUsd)
  )

  return {
    data: sortedPods,
    isFetched,
    ...remainder
  }
}
