import { useOnboard } from '@pooltogether/bnc-onboard-hooks'

import { useUsersPodTickets } from 'lib/hooks/useUsersPodTickets'

export const useUsersPodTicket = (podAddress) => {
  const { address: usersAddress } = useOnboard()
  const { data: podTickets, isFetched, ...remainingResponse } = useUsersPodTickets(usersAddress)

  if (!isFetched) {
    return {
      ...remainingResponse,
      isFetched,
      data: podTickets
    }
  }

  const podticket = podTickets.find((podTicket) => podTicket.address === podAddress)

  return {
    ...remainingResponse,
    isFetched,
    data: podticket
  }
}
