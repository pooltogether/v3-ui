import { useAllPodsByChainId } from 'lib/hooks/useAllPodsByChainId'

export const usePodsByChainId = (chainId) => {
  const { data, isFetched, ...remainder } = useAllPodsByChainId()
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
