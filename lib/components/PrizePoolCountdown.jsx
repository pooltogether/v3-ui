import React, { useEffect, useState } from 'react'
import addSeconds from 'date-fns/addSeconds'
import FeatherIcon from 'feather-icons-react'

import { subtractDates } from 'lib/utils/subtractDates'

export const PrizePoolCountdown = (
  props,
) => {
  const { pool } = props

  const [secondsRemaining, setSecondsRemaining] = useState(null)

  // const secs = 167868
  const secs = pool.prizePeriodRemainingSeconds &&
    parseInt(pool.prizePeriodRemainingSeconds.toString(), 10)

  useEffect(() => {
    setSecondsRemaining(secs)
  }, [secs])
 
  let formatted
  if (secondsRemaining) {
    const currentDate = new Date(Date.now())
    const futureDate = addSeconds(currentDate, secondsRemaining)

    const diff = subtractDates(futureDate, currentDate)

    formatted = `${diff.days}d ${diff.hours}h ${diff.minutes}m ${diff.seconds}s`
  } else {
    formatted = 'prize awarded soon ...'
  }

  return <>
    <FeatherIcon
      icon='clock'
      className='stroke-current w-4 h-4 sm:w-6 sm:h-6 inline-block mr-1'
    />
    {formatted}
  </>
}
