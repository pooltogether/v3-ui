import React, { useEffect, useState } from 'react'
import addSeconds from 'date-fns/addSeconds'

import { formatFutureDateInSeconds } from 'lib/utils/formatFutureDateInSeconds'
import { subtractDates } from 'lib/utils/subtractDates'

export const NewPrizePoolCountdown = (
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
 
  const formatted = formatFutureDateInSeconds(secondsRemaining)


  const currentDate = new Date(Date.now())
  const futureDate = addSeconds(currentDate, secondsRemaining)
  const diff = subtractDates(currentDate, futureDate)

  let msg
  // if (!secondsRemaining) {
  //   msg = <><div className='text-xxxs'>prize awarded soon...</div></>
  // }

  return <>
    <div
      className='flex text-center'
    >
      <div className='flex flex-col'>
        <span>{diff.days}</span>
        <div className='text-caption'>
          DAY
        </div>
      </div>
      <div className='flex flex-col'>
        <span>{diff.hours}</span>
        <div className='text-caption'>
          HR
        </div>
      </div>
      <div>:</div>
      <div className='flex flex-col'>
        {diff.minutes}
        <div className='text-caption'>
          MIN
        </div>
      </div>
      {msg}
    </div>
  </>
}
