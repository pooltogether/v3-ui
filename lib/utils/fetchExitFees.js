import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { readProvider } from 'lib/services/readProvider'

export const fetchExitFees = async (
  networkName,
  usersAddress,
  poolAddress,
  ticketAddress,
  quantityBN,
) => {
  const provider = await readProvider(networkName)
  const exitFees = {
    timelockDurationSeconds: ethers.utils.bigNumberify(0),
    exitFee: ethers.utils.bigNumberify(0),
  }

  try {
    const etherplexPrizePoolContract = contract(
      'prizePool',
      PrizePoolAbi,
      poolAddress
    )

    const values = await batch(
      provider,
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
  }
  catch (e) {
    console.warn(e.message)
  }
  finally {
    return exitFees
  }
}
