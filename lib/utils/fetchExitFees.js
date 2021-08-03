import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts_3_3/abis/PrizePool'

export const fetchExitFees = async (
  readProvider,
  usersAddress,
  poolAddress,
  ticketAddress,
  quantityBN
) => {
  const exitFees = {
    exitFee: ethers.BigNumber.from(0)
  }

  try {
    const etherplexPrizePoolContract = contract('prizePool', PrizePoolAbi, poolAddress)

    const values = await batch(
      readProvider,
      etherplexPrizePoolContract.calculateEarlyExitFee(usersAddress, ticketAddress, quantityBN)
    )

    exitFees.exitFee = values.prizePool.calculateEarlyExitFee.exitFee
  } catch (e) {
    console.warn(e.message)
  } finally {
    return exitFees
  }
}
