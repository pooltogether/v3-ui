import { V4_TICKET } from '@constants/v4Ticket'

export const getV4TicketContractAddress = (chainId: number) => V4_TICKET[chainId]?.address
