import { useInterval } from "beautiful-react-hooks"
import { addSeconds } from "date-fns"
import { subtractDates } from "lib/utils/subtractDates"
import { useState } from "react"

export const useTimeCountdown = (initialSecondsLeft, countBy = 1000) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSecondsLeft)

  useInterval(() => {
    const newRemainder = secondsLeft - countBy
    if (newRemainder >= 0) {
      setSecondsLeft(newRemainder)
    }
  }, countBy)

  const currentDate = new Date(Date.now())
  const futureDate = addSeconds(currentDate, secondsLeft)
  const { days, hours, minutes, seconds } = subtractDates(futureDate, currentDate)
  return { days, hours, minutes, seconds, secondsLeft }
}
