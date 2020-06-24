import { ethers } from 'ethers'

const PRECISION_MULTIPLIER = 1000000000

export function calculateUsersFractionOfWinnings(
  amountInEther,
  decimals,
  estimatedWinnings,
  podUserQuery,
  podPoolUserQuery,
) {
  let fractionOfWinnings = ethers.utils.bigNumberify(0)

  // This is the amount they will be purchasing
  const additionalAmount = ethers.utils.parseUnits(amountInEther, decimals)

  const userBalance = podUserQuery.balanceUnderlying
    .add(podUserQuery.pendingDeposit)
    .add(additionalAmount)

  // The Pod is technically a user so get it's balance in the Pool
  const podBalance = podPoolUserQuery.committedBalanceOf
    .add(podPoolUserQuery.openBalanceOf)
    .add(additionalAmount)

  if (podBalance.gt(0)) {
    const userBalHigh = userBalance.mul(PRECISION_MULTIPLIER)
    const podBalHigh = podBalance

    const podShareFraction = userBalHigh
      .div(podBalHigh)
      .mul(1000)

    const usersShare = estimatedWinnings
      .mul(podShareFraction)
      .div(PRECISION_MULTIPLIER)

    fractionOfWinnings = ethers.utils.bigNumberify(usersShare)
      .div(1000)
  }
  
  return fractionOfWinnings
}
