import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

export const fetchExitFees = async (
  readProvider,
  usersAddress,
  poolAddress,
  ticketAddress,
  quantityBN
) => {
  const exitFees = {
    timelockDurationSeconds: ethers.BigNumber.from(0),
    exitFee: ethers.BigNumber.from(0)
  }

  try {
    const etherplexPrizePoolContract = contract('prizePool', PrizePoolAbi, poolAddress)

    const values = await batch(
      readProvider,
      etherplexPrizePoolContract
        // .balanceOfCredit(usersAddress, ticketAddress)
        .calculateTimelockDuration(usersAddress, ticketAddress, quantityBN)
        .calculateEarlyExitFee(usersAddress, ticketAddress, quantityBN)
    )

    // Instant Withdrawal Credit/Fee
    // exitFees.burnedCredit = values.prizePool.balanceOfCredit[0]
    // exitFees.balanceOfCredit = values.prizePool.balanceOfCredit[0]
    exitFees.timelockDurationSeconds = values.prizePool.calculateTimelockDuration.durationSeconds
    exitFees.exitFee = values.prizePool.calculateEarlyExitFee.exitFee
  } catch (e) {
    console.warn(e.message)
  } finally {
    return exitFees
  }
}
