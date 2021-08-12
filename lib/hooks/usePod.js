import { useAllPodsByChainId } from 'lib/hooks/useAllPodsByChainId'

export const usePod = (chainId, podAddress) => {
  const { data: pods, isFetched, ...remainder } = useAllPodsByChainId()

  if (!isFetched) {
    return {
      data: pods,
      isFetched,
      ...remainder
    }
  }

  const pod = pods[chainId].find((pod) => pod.pod.address === podAddress)

  return {
    data: pod,
    isFetched,
    ...remainder
  }
}
