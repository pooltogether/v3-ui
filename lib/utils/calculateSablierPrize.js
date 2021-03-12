import { ethers } from 'ethers'
import { secondsSinceEpoch } from 'lib/utils/secondsSinceEpoch'

// Edge cases:
// If the stream gets cancelled: then the streamed amount is never claimed
// Stream changes: old stream doesn't get claimed, new stream will go through
// this function
// Historic prizes: are captured in the awarded prize amount, so reading from Sablier
// isn't necessary

export const calculateSablierPrize = (sablierData, prizeStrategyData) => {
  const {
    startTime,
    stopTime,
    ratePerSecond,
    tokenDecimals,
    tokenSymbol,
    tokenName,
    tokenAddress
  } = sablierData
  const { prizePeriodStartedAt, prizePeriodSeconds, isRngRequested } = prizeStrategyData
  const prizePeriodEndsAt = prizePeriodStartedAt.add(prizePeriodSeconds)
  const currentTime = ethers.BigNumber.from(secondsSinceEpoch())

  // Stream hasn't started yet
  if (prizePeriodEndsAt.lt(startTime)) return ethers.constants.Zero

  let dripEnd
  // If people take too long to award the prize, the stream will be added to that earlier prize
  if (stopTime.gt(prizePeriodEndsAt) && currentTime.gt(prizePeriodEndsAt) && !isRngRequested) {
    dripEnd = stopTime.lte(currentTime) ? stopTime : currentTime
  } else {
    dripEnd = stopTime.lte(prizePeriodEndsAt) ? stopTime : prizePeriodEndsAt
  }
  const dripStart = startTime.gte(prizePeriodStartedAt) ? startTime : prizePeriodStartedAt
  const dripTime = dripEnd.sub(dripStart)
  const amountThisPrizePeriod = dripTime.mul(ratePerSecond)

  const amountPerPrizePeriod = prizePeriodSeconds.mul(ratePerSecond)

  return { amountThisPrizePeriod, amountPerPrizePeriod }
}
