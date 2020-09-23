import React, { useEffect, useState } from 'react'
import addSeconds from 'date-fns/addSeconds'
import { useInterval } from 'beautiful-react-hooks'

import { subtractDates } from 'lib/utils/subtractDates'

const ONE_SECOND = 1000

export const NewPrizeCountdownInWords = (
  props,
) => {
  const { pool } = props
  let flashy = props.flashy === false ? false : true

  const [secondsRemaining, setSecondsRemaining] = useState(null)

  console.log('b', pool?.prizePeriodRemainingSeconds?.toString())

  const secs = pool?.prizePeriodRemainingSeconds &&
    parseInt(pool?.prizePeriodRemainingSeconds.toString(), 10)

  useEffect(() => {
    setSecondsRemaining(secs)
  }, [secs])

  useInterval(() => {
    setSecondsRemaining(secondsRemaining - 1)
  }, ONE_SECOND)

  if (!pool) {
    return null
  }

  const currentDate = new Date(Date.now())
  // for testing:
  // const futureDate = addSeconds(currentDate, secondsRemaining + 950044)
  const futureDate = addSeconds(currentDate, secondsRemaining)
  const { days, hours, minutes, seconds } = subtractDates(futureDate, currentDate)

  let content
  if (pool?.isRngRequested) {
    content = <>Prize is being awarded now!</>
  } else if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    content = <>Prize will be awarded soon...</>
  } else {
    const daysArray = ('' + days).split('')
    const hoursArray = ('' + hours).split('')
    const minutesArray = ('' + minutes).split('')
    const secondsArray = ('' + seconds).split('')

    content = <>
      {daysArray.length > 1 ? daysArray[1] : daysArray[0]} days,&nbsp;

      {hoursArray.length > 1 ? hoursArray[1] : hoursArray[0]} hours,&nbsp;

      {minutesArray.length > 1 ? minutesArray[1] : minutesArray[0]} minutes, and&nbsp;

      {secondsArray.length > 1 ? secondsArray[1] : secondsArray[0]} seconds
    </>
  }

  
  return <>
    <div
      className='text-inverse font-bold text-flashy'
      style={{
        display: 'block'
      }}
    >
      {content}
    </div>
  </>
}
