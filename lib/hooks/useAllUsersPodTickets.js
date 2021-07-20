import { useQuery } from 'react-query'
import { usePodChainIds, useReadProviders } from '@pooltogether/hooks'
import { batch, contract } from '@pooltogether/etherplex'
import { addTokenTotalUsdValue, sToMs } from '@pooltogether/utilities'

import PodAbi from 'abis/PodAbi'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useAllPods } from 'lib/hooks/useAllPods'
import { formatUnits } from 'ethers/lib/utils'

export const useAllUsersPodTickets = (usersAddress) => {
  const { data: podsByChainId, isFetched } = useAllPods()
  const chainIds = usePodChainIds()
  const { readProviders, isReadProvidersReady } = useReadProviders(chainIds)

  const enabled = isFetched && isReadProvidersReady && Boolean(usersAddress)

  return useQuery(
    [QUERY_KEYS.getPodTickets],
    () => getAllPodTickets(readProviders, chainIds, podsByChainId, usersAddress),
    {
      enabled,
      refetchInterval: sToMs(20)
    }
  )
}

const getAllPodTickets = async (providers, chainIds, podsByChainId, usersAddress) => {
  const podTickets = await Promise.all(
    chainIds.map((chainId) =>
      getPodTickets(usersAddress, providers[chainId], podsByChainId[chainId])
    )
  )

  const podTicketsByChainIds = {}
  chainIds.map((chainId, index) => {
    podTicketsByChainIds[chainId] = podTickets[index]
  })

  return podTicketsByChainIds
}

const getPodTickets = async (usersAddress, provider, pods) => {
  const batchCalls = []
  pods.forEach((pod) => {
    const podContract = contract(
      pod.tokens.podStablecoin.address,
      PodAbi,
      pod.tokens.podStablecoin.address
    )
    batchCalls.push(podContract.balanceOf(usersAddress))
  })

  const response = await batch(provider, ...batchCalls)

  return formatPodTicketsResponse(pods, response)
}

const formatPodTicketsResponse = (pods, podTickets) => {
  const formattedPodTickets = []

  pods.forEach((pod) => {
    const amountUnformatted = podTickets[pod.tokens.podStablecoin.address].balanceOf[0]
    const amount = formatUnits(amountUnformatted, pod.tokens.podStablecoin.decimals)

    const podTicket = {
      ...pod.tokens.podStablecoin,
      amountUnformatted,
      amount,
      pod
    }
    addTokenTotalUsdValue(podTicket, { [podTicket.address]: pod.tokens.podStablecoin })
    formattedPodTickets.push(podTicket)
  })
  return formattedPodTickets
}
