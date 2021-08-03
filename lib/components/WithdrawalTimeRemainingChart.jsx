import React from 'react'
import addSeconds from 'date-fns/addSeconds'

import { useTranslation } from 'react-i18next'
import { Gauge } from 'lib/components/Gauge'
import { subtractDates } from 'lib/utils/subtractDates'
import { useMaxTimelockDurationSeconds } from 'lib/hooks/useMaxTimelockDurationSeconds'
import { useUsersAddress } from '@pooltogether/hooks'
import { useUserTicketsByPool } from 'lib/hooks/useUserTickets'

const _varName = ({ days, hours, minutes }) => {
  let varName

  if (days === 0 && hours === 0 && minutes === 0) {
    varName = 'seconds'
  } else if (days === 0 && hours === 0) {
    varName = 'minutes'
  } else if (days === 0) {
    varName = 'hours'
  } else if (days > 0) {
    varName = 'days'
  }

  return varName
}

const _label = (t, timeRemainingObj) => {
  const varName = _varName(timeRemainingObj)
  const value = timeRemainingObj[varName]

  return t(`${varName}ToGoUntilFreeWithdrawal`, {
    [varName]: parseInt(value, 10)
  })
}

export function WithdrawalTimeRemainingChart(props) {
  const { t } = useTranslation()

  const { pool, exitFees } = props

  const { timelockDurationSeconds } = exitFees

  const secondsRemaining = timelockDurationSeconds.toNumber()

  const currentDate = new Date(Date.now())
  const futureDate = addSeconds(currentDate, secondsRemaining)
  const timeRemainingObj = subtractDates(futureDate, currentDate)

  const { data: maxTimelockDurationSeconds, isFetched } = useMaxTimelockDurationSeconds(
    pool,
    exitFees?.exitFee
  )

  if (!isFetched) return null

  const percentTimeRemaining = (secondsRemaining / parseInt(maxTimelockDurationSeconds, 10)) * 100

  return (
    <>
      <div
        className='mt-10 mb-6 text-highlight-3'
        style={{
          maxHeight: 220
        }}
      >
        <Gauge
          label={
            <>
              <div className='text-6xl sm:text-7xl font-bold time-remaining-chart--big-num'>
                {timeRemainingObj[_varName(timeRemainingObj)]}
              </div>
              <div className='text-lg font-bold'>{t(`${_varName(timeRemainingObj)}Left`)}</div>
              <div
                className='text-xxxs mt-8 sm:mt-4 mx-auto'
                style={{
                  maxWidth: 160
                }}
              >
                {_label(t, timeRemainingObj)}
              </div>
            </>
          }
          value={Math.abs(100 - percentTimeRemaining)}
        />
      </div>
    </>
  )
}
