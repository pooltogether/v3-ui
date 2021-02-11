import React from 'react'
import CountUp from 'react-countup'
import { usePreviousValue } from 'beautiful-react-hooks'

export const NumberCountUp = props => {
  const { amount, ...countUpProps } = props
  const prevAmount = usePreviousValue(amount)

  return <CountUp
    start={prevAmount}
    end={amount}
    {...countUpProps}
  />
}

NumberCountUp.defaultProps = {
  amount: 0
}
