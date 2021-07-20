import React from 'react'
import { TicketRow, TokenIcon } from '@pooltogether/react-components'
import { TicketPrize } from 'lib/components/TicketPrize'
import { TicketAmount } from 'lib/components/TicketAmount'

export const PodTicket = (props) => (
  <TicketRow left={<PodTicketLeft {...props} />} right={<PodTicketRight {...props} />} />
)

const PodTicketLeft = (props) => {
  const { podTicket } = props
  const { pod } = podTicket

  return (
    <div className='flex flex-col justify-center'>
      <TokenIcon
        className='mx-auto'
        address={pod.tokens.underlyingToken.address}
        chainId={pod.metadata.chainId}
      />
      <span className='mt-2 mx-auto font-bold'>{pod.tokens.underlyingToken.symbol}</span>
    </div>
  )
}

const PodTicketRight = (props) => {
  const { podTicket } = props
  const { pod } = podTicket

  return (
    <div className='flex flex-col sm:flex-row justify-between'>
      <div className='flex flex-col'>
        <TicketAmount amount={podTicket.amount} />
      </div>
      <div className='flex flex-col'>
        <TicketPrize prize={pod.prize} />
      </div>
    </div>
  )
}
