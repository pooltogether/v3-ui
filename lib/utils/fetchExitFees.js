import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PrizeStrategy'

import { readProvider } from 'lib/utils/readProvider'

export const fetchExitFees = async (
  networkName,
  usersAddress,
  prizeStrategyAddress,
  ticketAddress,
  tickets,
) => {
  console.log({
    networkName,
    usersAddress,
    prizeStrategyAddress,
    ticketAddress,
    tickets,
  })
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
      PrizeStrategyAbi,
      prizeStrategyAddress
    )
    console.log('getting exit fees')
    console.log(etherplexStrategyContract)

    const values = await batch(
      provider,
      etherplexStrategyContract
        .calculateInstantWithdrawalFee(usersAddress, tickets, ticketAddress)
        .calculateTimelockDurationAndFee(usersAddress, tickets, ticketAddress)
    )

    // Instant Withdrawal Credit/Fee
    exitFees.instantCredit = values.prizeStrategy.calculateInstantWithdrawalFee.burnedCredit
    exitFees.instantFee = values.prizeStrategy.calculateInstantWithdrawalFee.remainingFee

    // Scheduled Withdrawal Credit/Duration
    exitFees.timelockCredit = values.prizeStrategy.calculateTimelockDurationAndFee.burnedCredit
    exitFees.timelockDuration = values.prizeStrategy.calculateTimelockDurationAndFee.durationSeconds

    console.log('here', exitFees)
    // throw new Error('what if this always fails')
  } catch (e) {
    console.warn(e.message)
  }
  finally {
    return exitFees
  }
}
