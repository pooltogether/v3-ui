import { useTimeCountdown } from 'lib/hooks/useTimeCountdown'
import { getSecondsSinceEpoch } from 'lib/utils/getSecondsSinceEpoch'

export const usePrizePeriodTimeLeft = (pool) => {
  const prizePeriodDurationInSeconds = pool.prize.prizePeriodSeconds.toNumber()
  const prizePeriodStartedAtInSeconds = pool.prize.prizePeriodStartedAt.toNumber()
  const currentTimeInSeconds = getSecondsSinceEpoch()

  const secondsSinceStartOfPrizePeriod = currentTimeInSeconds - prizePeriodStartedAtInSeconds
  const initialSecondsLeft = prizePeriodDurationInSeconds - secondsSinceStartOfPrizePeriod

  return useTimeCountdown(initialSecondsLeft)
}
