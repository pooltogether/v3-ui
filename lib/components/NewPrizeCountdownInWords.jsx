import React from 'react'
import addSeconds from 'date-fns/addSeconds'

import { useTranslation } from 'react-i18next'
import { subtractDates } from 'lib/utils/subtractDates'
import { usePrizePeriodTimeLeft } from 'lib/hooks/usePrizePeriodTimeLeft'

export const NewPrizeCountdownInWords = (props) => {
  const { t } = useTranslation()
  const { pool, extraShort, onTicket } = props

  const { secondsLeft } = usePrizePeriodTimeLeft(pool)

  const currentDate = new Date(Date.now())
  const futureDate = addSeconds(currentDate, secondsLeft)
  const { days, hours, minutes, seconds } = subtractDates(futureDate, currentDate)

  const daysArray = ('' + days).split('')
  const hoursArray = ('' + hours).split('')
  const minutesArray = ('' + minutes).split('')
  const secondsArray = ('' + seconds).split('')

  const daysWords = daysArray.length > 1 ? daysArray.join('') : daysArray[0]
  const hoursWords = hoursArray.length > 1 ? hoursArray.join('') : hoursArray[0]
  const minutesWords = minutesArray.length > 1 ? minutesArray.join('') : minutesArray[0]
  const secondsWords = secondsArray.length > 1 ? secondsArray.join('') : secondsArray[0]

  let content
  if (pool.prize.isRngRequested) {
    content = <>{t('prizeIsBeingAwarded')}</>
  } else if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    content = <>{t('prizeAwardedSoon')}</>
  } else {
    content = (
      <>
        {daysWords !== '0' && <>{t('numDays', { days: daysWords })}, </>}
        {hoursWords !== '0' && <>{t('numHours', { hours: hoursWords })}, </>}
        {minutesWords !== '0' && <>{t('numMinutes', { minutes: minutesWords })}, </>}
        {secondsWords !== '0' && <>{t('numSeconds', { seconds: secondsWords })}</>}
      </>
    )
  }

  if (extraShort && pool.prize.isRngRequested) {
    content = <>{t('beingAwarded')}</>
  } else if (extraShort && days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    content = <span className='font-normal ml-2'>{t('awarding')}</span>
  } else if (extraShort) {
    content = (
      <>
        {onTicket && <span className='font-normal mx-1'>{t('in')}</span>}
        {daysWords !== '0' && <>{t('numDaysShort', { days: daysWords })}, </>}
        {hoursWords !== '0' && <>{t('numHoursShort', { hours: hoursWords })}, </>}
        {minutesWords !== '0' && <>{t('numMinutesShort', { minutes: minutesWords })}, </>}
        {t('numSecondsShort', { seconds: secondsWords })}
      </>
    )
  }

  return content
}
