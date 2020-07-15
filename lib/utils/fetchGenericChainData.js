import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from 'ERC20Abi'
import CompoundPeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPeriodicPrizePool'

export const fetchGenericChainData = async (
  provider,
  pool,
) => {
  const {
    id,
    sponsorship,
  } = pool

  const poolAddress = id
  
  if (
    provider &&
    poolAddress &&
    sponsorship
  ) {
    try {
      const etherplexPrizePoolContract = contract(
        'prizePool',
        CompoundPeriodicPrizePoolAbi,
        poolAddress
      )
      const etherplexSponsorshipContract = contract(
        'sponsorship',
        ERC20Abi,
        sponsorship
      )

      const values = await batch(
        provider,
        etherplexPrizePoolContract
          // .isRngRequested() // used to determine if the pool is locked
          // .canStartAward()
          // .canCompleteAward()
          .prizePeriodRemainingSeconds()
          .estimateRemainingPrize(),
        // etherplexSponsorshipContract
        //   .name()
        //   .symbol()
        //   .totalSupply(),
      )

      return {
        // isRngRequested: values.prizePool.isRngRequested[0],
        // canStartAward: values.prizePool.canStartAward[0],
        // canCompleteAward: values.prizePool.canCompleteAward[0],
        estimateRemainingPrize: values.prizePool.estimateRemainingPrize[0],
        prizePeriodRemainingSeconds: values.prizePool.prizePeriodRemainingSeconds[0],
        // sponsorshipName: values.sponsorship.name,
        // sponsorshipSymbol: values.sponsorship.symbol,
        // sponsorshipTotalSupply: values.sponsorship.totalSupply,
        loading: false,
      }
    } catch (e) {
      console.warn(e.message)
      throw new Error(e)
    }

  }
}
