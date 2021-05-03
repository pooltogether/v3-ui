import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { formatFutureDateInSeconds } from 'lib/utils/formatFutureDateInSeconds'
import { usePrizePeriodTimeLeft } from 'lib/hooks/usePrizePeriodTimeLeft'

export const PrizePoolCountdown = (props) => {
  const { pool } = props

  const { secondsLeft } = usePrizePeriodTimeLeft(pool)

  const formatted = formatFutureDateInSeconds(secondsLeft)

  let msg
  if (!secondsLeft) {
    msg = (
      <>
        <div className='text-xxxs'>prize awarded soon...</div>
      </>
    )
  }

  return (
    <>
      <FeatherIcon
        icon='clock'
        className='stroke-current w-6 h-6 sm:w-6 sm:h-6 inline-block mr-1'
      />
      <div className='ml-2'>
        {formatted}
        {msg}
      </div>
    </>
  )
}
