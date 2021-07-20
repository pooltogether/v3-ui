import { useAllUsersPodTickets } from 'lib/hooks/useAllUsersPodTickets'

export const useUsersPodTickets = (usersAddress) => {
  const { data: podTicketsByChainId, isFetched, ...remainder } = useAllUsersPodTickets(usersAddress)

  if (!isFetched) {
    return {
      ...remainder,
      data: podTicketsByChainId,
      isFetched
    }
  }

  const flattenedAndFilteredPodTickets = []
  const chainIds = Object.keys(podTicketsByChainId)
  chainIds.map((chainId) => {
    const podTickets = podTicketsByChainId[chainId]
    const filteredTickets = podTickets.filter((podTicket) => !podTicket.amountUnformatted.isZero())
    flattenedAndFilteredPodTickets.push(...filteredTickets)
  })

  return {
    ...remainder,
    data: flattenedAndFilteredPodTickets,
    isFetched
  }
}
