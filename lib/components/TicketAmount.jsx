import React from 'react'
import { Amount } from '@pooltogether/react-components'
import { numberWithCommas } from '@pooltogether/utilities'

export const TicketAmount = (props) => (
  <div className='text-lg sm:text-2xl font-bold text-inverse-purple mb-1 leading-none'>
    <Amount>{numberWithCommas(props.amount)}</Amount>
  </div>
)
