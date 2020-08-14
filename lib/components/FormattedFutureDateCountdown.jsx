import React, { useEffect, useState } from 'react'
import addSeconds from 'date-fns/addSeconds'
import { useInterval } from 'beautiful-react-hooks'


import { formatFutureDateInSeconds } from 'lib/utils/formatFutureDateInSeconds'
import { subtractDates } from 'lib/utils/subtractDates'

const ONE_SECOND = 1000

export const FormattedFutureDateCountdown = (
  props,
) => {
  const { futureDate } = props

  const [secondsRemaining, setSecondsRemaining] = useState(null)

  useEffect(() => {
    setSecondsRemaining(futureDate)
  }, [futureDate])

  useInterval(() => {
    setSecondsRemaining(secondsRemaining - 1)
  }, ONE_SECOND)

  const formattedFutureDate = formatFutureDateInSeconds(
    secondsRemaining
  )

  return <>
    <span
      className='font-bold'
    >
      {formattedFutureDate} 
    </span>
  </>
}
