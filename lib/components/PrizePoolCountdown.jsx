import React, { useEffect, useState } from 'react'
import FeatherIcon from 'feather-icons-react'

import { formatFutureDateInSeconds } from 'lib/utils/formatFutureDateInSeconds'

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
 
  const formatted = formatFutureDateInSeconds(secondsRemaining)

  let msg
  if (!secondsRemaining) {
    msg = <><div className='text-xxxs'>prize awarded soon...</div></>
  }

  return <>
    <FeatherIcon
      icon='clock'
      className='stroke-current w-4 h-4 sm:w-6 sm:h-6 inline-block mr-1'
    />
    <div
      className='ml-2'
    >
      {formatted}{msg}
    </div>
  </>
}
