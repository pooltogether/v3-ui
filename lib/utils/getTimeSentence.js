/**
 * Generates a sentence for the amount of time provided
 * Ex. "2 days, 24 minutes", "60 seconds", "3 hours, 1 second"
 * @param {*} t
 * @param {*} years
 * @param {*} weeks
 * @param {*} days
 * @param {*} hours
 * @param {*} minutes
 * @param {*} seconds
 * @returns
 */
export const getTimeSentence = (t, years, weeks, days, hours, minutes, seconds) => {
  const timeData = {
    seconds: {
      amount: seconds,
      unit: 'second'
    },
    minutes: {
      amount: minutes,
      unit: 'minute',
      after: seconds
    },
    hours: {
      amount: hours,
      unit: 'hour',
      after: minutes || seconds
    },
    days: {
      amount: days,
      unit: 'day',
      after: hours || minutes || seconds
    },
    weeks: {
      amount: weeks,
      unit: 'week',
      after: days || hours || minutes || seconds
    },
    years: {
      amount: years,
      unit: 'year',
      after: weeks || days || hours || minutes || seconds
    }
  }
  return [
    timeData.years,
    timeData.weeks,
    timeData.days,
    timeData.hours,
    timeData.minutes,
    timeData.seconds
  ]
    .map(
      (timeUnit) =>
        `${getTimeUnitDisplay(t, timeUnit.amount, timeUnit.unit)}${getComma(
          timeUnit.amount,
          timeUnit.after
        )}`
    )
    .join('')
    .toLowerCase()
}

/**
 * Returns a string containing the transalted amount & unit
 * amount is 0 -> ''
 * amount is 1 -> '1 minute'
 * amount is > 1 -> 'X minutes'
 * @param {*} t
 * @param {*} amount
 * @param {*} unit
 * @returns
 */
const getTimeUnitDisplay = (t, amount, unit) =>
  amount ? `${amount} ${t(amount === 1 ? unit : `${unit}s`)}` : ''

/**
 * Returns a comma if it is needed
 * @param {*} amount if there's any of the current unit
 * @param {*} after time units after the current unit
 * @returns
 */
const getComma = (amount, after) => (amount && after ? ', ' : '')
