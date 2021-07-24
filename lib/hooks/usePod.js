import { useAllPods } from 'lib/hooks/useAllPods'

export const usePod = (chainId, podAddress) => {
  const { data: pods, isFetched, ...remainder } = useAllPods()

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
