import { ethers } from 'ethers'
import { useUsersPodTickets } from 'lib/hooks/useUsersPodTickets'

export const useUsersTotalPodDepositsValue = (usersAddress) => {
  const { data: usersPodTickets, ...podTicketData } = useUsersPodTickets(usersAddress)
  const totalValueUsdScaled =
    usersPodTickets?.reduce(
      (total, podTicket) => podTicket.totalValueUsdScaled.add(podTicket.totalValueUsdScaled),
      ethers.constants.Zero
    ) || ethers.constants.Zero
  return {
    ...podTicketData,
    data: {
      totalValueUsdScaled,
      totalValueUsd: ethers.utils.formatUnits(totalValueUsdScaled, 2)
    }
  }
}
