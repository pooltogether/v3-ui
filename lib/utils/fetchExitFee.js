import { batch, contract } from '@pooltogether/etherplex'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { readProvider } from 'lib/utils/getReadProvider'

export const fetchExitFee = async (
  networkName,
  usersAddress,
  prizePoolAddress,
  tickets,
) => {
  const provider = await readProvider(networkName)

  try {
    const etherplexPoolContract = contract(
      'pool',
      PrizePoolAbi,
      prizePoolAddress
    )

    const values = await batch(
      provider,
      etherplexPoolContract
        .calculateExitFee(usersAddress, tickets)
        // .calculateUnlockTimestamp(usersAddress)
    )

    return {
      exitFee: values.pool.calculateExitFee[0]
    }
  } catch (e) {
    console.warn(e.message)
  }
}
