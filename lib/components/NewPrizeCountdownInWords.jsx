import React, { useEffect, useState } from 'react'
import addSeconds from 'date-fns/addSeconds'
import classnames from 'classnames'
import { useInterval } from 'beautiful-react-hooks'

import { useTranslation } from 'lib/../i18n'
import { subtractDates } from 'lib/utils/subtractDates'

const ONE_SECOND = 1000

export const NewPrizeCountdownInWords = (
  props,
) => {
  const { t } = useTranslation()
  const { pool, extraShort, text } = props

  const [secondsRemaining, setSecondsRemaining] = useState(null)

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
    content = <>
      {t('prizeIsBeingAwarded')}
    </>
  } else if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    content = <>
      {t('prizeAwardedSoon')}
    </>
  } else {
    const daysArray = ('' + days).split('')
    const hoursArray = ('' + hours).split('')
    const minutesArray = ('' + minutes).split('')
    const secondsArray = ('' + seconds).split('')

    content = <>
      {daysArray.length > 1 ? daysArray.join('') : daysArray[0]} days,&nbsp;

      {hoursArray.length > 1 ? hoursArray.join('') : hoursArray[0]} hours,&nbsp;

      {minutesArray.length > 1 ? minutesArray.join('') : minutesArray[0]} minutes, and&nbsp;

      {secondsArray.length > 1 ? secondsArray.join('') : secondsArray[0]} seconds
    </>
  }


  if (extraShort && pool?.isRngRequested) {
    content = <>
      {t('beingAwarded')}
    </>
  } else if (extraShort && days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    content = <>
      {t('awardedSoon')}
    </>
  } else if (extraShort) {
    const daysArray = ('' + days).split('')
    const hoursArray = ('' + hours).split('')
    const minutesArray = ('' + minutes).split('')
    const secondsArray = ('' + seconds).split('')

    content = <>
      <div
        className='font-normal'
      >{t('prizeIn')}</div> {daysArray.length > 1 ? daysArray.join('') : daysArray[0]}d,&nbsp;

      {hoursArray.length > 1 ? hoursArray.join('') : hoursArray[0]}h,&nbsp;

      {minutesArray.length > 1 ? minutesArray.join('') : minutesArray[0]}m,&nbsp;

      {secondsArray.length > 1 ? secondsArray.join('') : secondsArray[0]}s
    </>
  }

  
  return <>
    <div
      className={classnames(
        'font-bold',
        {
          [`text-${text}`]: text,
          'text-flashy': !text
        }
      )}
      style={{
        display: 'block'
      }}
    >
      {content}
    </div>
  </>
}
