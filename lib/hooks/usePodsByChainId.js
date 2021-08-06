import { useAllPods } from 'lib/hooks/useAllPods'

export const usePodsByChainId = (chainId) => {
  const { data, isFetched, ...remainder } = useAllPods()
  if (!isFetched) {
    return {
      ...remainder,
      isFetched,
      data
    }
  } else {
    return {
      ...remainder,
      isFetched,
      data: data[chainId]
    }
  }
}
