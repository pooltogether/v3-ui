import React, { useEffect, useState } from 'react'
import addSeconds from 'date-fns/addSeconds'

import { formatFutureDateInSeconds } from 'lib/utils/formatFutureDateInSeconds'
import { subtractDates } from 'lib/utils/subtractDates'

export const NewPrizeCountdown = (
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

  const currentDate = new Date(Date.now())
  // for testing:
  // const futureDate = addSeconds(currentDate, secondsRemaining + 950044)
  const futureDate = addSeconds(currentDate, secondsRemaining)
  const diff = subtractDates(futureDate, currentDate)
  const { days, hours, minutes, seconds } = subtractDates(futureDate, currentDate)

  let msg
  // if (!secondsRemaining) {
  //   msg = <><div className='text-xxxs'>prize awarded soon...</div></>
  // }

  const daysArray = ('' + days).split('')
  const hoursArray = ('' + hours).split('')
  const minutesArray = ('' + minutes).split('')
  const secondsArray = ('' + seconds).split('')

  const textColor = minutes > 2 ?
    'green' :
    minutes > 1 ?
      'yellow' :
      'red'
  // const textColor = days > 2 ?
  //   'green' :
  //   days > 1 ?
  //     'yellow' :
  //     'red'

  const LeftSideJsx = ({ digit }) => {
    return <span
      className={`bg-white text-${textColor} font-bold border border-accent-1 rounded-tl-md rounded-bl-md`}
      style={{
        padding: '1px 4px',
        borderWidth: '0.015rem'
      }}
    >
      {digit}
    </span>
  }

  const RightSideJsx = ({ digit }) => {
    return <span
      className={`bg-white text-${textColor} font-bold border border-accent-1 rounded-tr-md rounded-br-md border-l-0`}
      style={{
        padding: '1px 4px',
        borderWidth: '0.015rem'
      }}
    >
      {digit}
    </span>
  }

  return <>
    <div
      className='flex text-center'
    >
      <div
        className='flex flex-col px-1'
        style={{
          minWidth: 50
        }}
      >
        <div className='flex'>
          <LeftSideJsx
            digit={daysArray.length < 2 ? 0 : daysArray[0]}
          />
          <RightSideJsx
            digit={daysArray.length > 1 ? daysArray[1] : daysArray[0]}
          />
        </div>
        <div className='text-caption'>
          DAY
        </div>
      </div>
      <div
        className='flex flex-col px-1'
        style={{
          minWidth: 50
        }}
      >
        <div className='flex'>
          <LeftSideJsx
            digit={hoursArray.length < 2 ? 0 : hoursArray[0]}
          />
          <RightSideJsx
            digit={hoursArray.length > 1 ? hoursArray[1] : hoursArray[0]}
          />
        </div>
        <div className='text-caption'>
          HR
        </div>
      </div>
      <div
        className='px-0 sm:px-1'
      >
        :
      </div>
      <div
        className='flex flex-col px-1'
        style={{
          minWidth: 50
        }}
      >
        <div className='flex'>
          <LeftSideJsx
            digit={minutesArray.length < 2 ? 0 : minutesArray[0]}
          />
          <RightSideJsx
            digit={minutesArray.length > 1 ? minutesArray[1] : minutesArray[0]}
          />
        </div>
        <div className='text-caption'>
          MIN
        </div>
      </div>
      <div
        className='px-0 sm:px-1 hidden sm:block'
      >
        :
      </div>
      <div
        className='flex flex-col px-1 hidden sm:block'
        style={{
          minWidth: 50
        }}
      >
        <div className='flex'>
          <LeftSideJsx
            digit={secondsArray.length < 2 ? 0 : secondsArray[0]}
          />
          <RightSideJsx
            digit={secondsArray.length > 1 ? secondsArray[1] : secondsArray[0]}
          />
        </div>
        <div className='text-caption'>
          SEC
        </div>
      </div>
      {msg}
    </div>
  </>
}
