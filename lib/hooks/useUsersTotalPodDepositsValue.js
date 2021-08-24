import { ethers } from 'ethers'
import { useUsersPodTickets } from 'lib/hooks/useUsersPodTickets'

export const useUsersTotalPodDepositsValue = (usersAddress) => {
  const { data: usersPodTickets, ...podTicketData } = useUsersPodTickets(usersAddress)

  let totalValueUsdScaled = ethers.constants.Zero
  usersPodTickets?.forEach((podTicket) => {
    totalValueUsdScaled = totalValueUsdScaled.add(podTicket.totalValueUsdScaled)
  })

  return {
    ...podTicketData,
    data: {
      totalValueUsdScaled,
      totalValueUsd: ethers.utils.formatUnits(totalValueUsdScaled, 2)
    }
  }
}
