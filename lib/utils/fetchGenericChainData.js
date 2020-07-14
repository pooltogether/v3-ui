import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from 'ERC20Abi'
import CompoundPeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPeriodicPrizePool'

export const fetchGenericChainData = async (
  provider,
  pool,
) => {
  const {
    id,
    ticket,
    sponsorship,
    underlyingCollateralToken,
  } = pool

  const poolAddress = id
  
  if (
    provider &&
    poolAddress &&
    ticket &&
    sponsorship
  ) {
    // TODO: don't need to get most of this from infura!

    try {
      const etherplexPrizePoolContract = contract(
        'prizePool',
        CompoundPeriodicPrizePoolAbi,
        poolAddress
      )
      const etherplexTicketContract = contract(
        'ticket',
        ERC20Abi,
        ticket
      )
      const etherplexSponsorshipContract = contract(
        'sponsorship',
        ERC20Abi,
        sponsorship
      )
      const etherplexTokenContract = contract(
        'token',
        ERC20Abi,
        underlyingCollateralToken
      )

      const values = await batch(
        provider,
        etherplexPrizePoolContract
          .isRngRequested() // used to determine if the pool is locked
          .canStartAward()
          .canCompleteAward()
          .prizePeriodRemainingSeconds()
          .estimateRemainingPrize(),
        etherplexTicketContract
          .name()
          .symbol()
          .totalSupply(),
        etherplexSponsorshipContract
          .name()
          .symbol()
          .totalSupply(),
        etherplexTokenContract
          .decimals()
          .symbol(),
      )

      let decimals = values.token.decimals[0]
      // default to 18 if the ERC20 contract returns 0 for decimals
      decimals = decimals === 0 ? 18 : decimals

      return {
        canStartAward: values.prizePool.canStartAward[0],
        canCompleteAward: values.prizePool.canCompleteAward[0],
        estimateRemainingPrize: values.prizePool.estimateRemainingPrize[0],
        isRngRequested: values.prizePool.isRngRequested[0],
        prizePeriodRemainingSeconds: values.prizePool.prizePeriodRemainingSeconds[0],
        sponsorshipName: values.sponsorship.name,
        sponsorshipSymbol: values.sponsorship.symbol,
        sponsorshipTotalSupply: values.sponsorship.totalSupply,
        ticketName: values.ticket.name,
        ticketSymbol: values.ticket.symbol,
        ticketTotalSupply: values.ticket.totalSupply,
        tokenDecimals: decimals,
        tokenSymbol: values.token.symbol[0],
        loading: false,
      }
    } catch (e) {
      console.warn(e.message)
      throw new Error(e)
    }

  }
}
