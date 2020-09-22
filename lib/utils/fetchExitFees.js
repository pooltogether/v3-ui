import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

import { readProvider } from 'lib/utils/readProvider'

export const fetchExitFees = async (
  networkName,
  usersAddress,
  prizeStrategyAddress,
  ticketAddress,
  quantityBN,
) => {
  const provider = await readProvider(networkName)
  const exitFees = {
    instantCredit: ethers.utils.bigNumberify(0),
    instantFee: ethers.utils.bigNumberify(0),
    timelockCredit: ethers.utils.bigNumberify(0),
    timelockDuration: ethers.utils.bigNumberify(0),
  }

  try {
    const etherplexStrategyContract = contract(
      'prizeStrategy',
      SingleRandomWinnerAbi,
      prizeStrategyAddress
    )

    const values = await batch(
      provider,
      etherplexStrategyContract
        .calculateInstantWithdrawalFee(usersAddress, quantityBN, ticketAddress)
        .calculateTimelockDurationAndFee(usersAddress, quantityBN, ticketAddress)
    )

    // Instant Withdrawal Credit/Fee
    exitFees.instantCredit = values.prizeStrategy.calculateInstantWithdrawalFee.burnedCredit
    exitFees.instantFee = values.prizeStrategy.calculateInstantWithdrawalFee.remainingFee

    // Scheduled Withdrawal Credit/Duration
    exitFees.timelockCredit = values.prizeStrategy.calculateTimelockDurationAndFee.burnedCredit
    exitFees.timelockDuration = values.prizeStrategy.calculateTimelockDurationAndFee.durationSeconds

    // TODO: test this!
    // throw new Error('what if this always fails')
  } catch (e) {
    console.warn(e.message)
  }
  finally {
    return exitFees
  }
}
