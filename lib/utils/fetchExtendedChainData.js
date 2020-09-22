import { batch, contract } from '@pooltogether/etherplex'

// import ERC20Abi from 'ERC20Abi'
import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

export const fetchExtendedChainData = async (
  provider,
  prizeStrategyAddress,
) => {
  if (
    provider &&
    prizeStrategyAddress
    // sponsorship
  ) {
    try {
      const etherplexPrizeStrategyContract = contract(
        'prizeStrategy',
        SingleRandomWinnerAbi,
        prizeStrategyAddress
      )
      // const etherplexSponsorshipContract = contract(
      //   'sponsorship',
      //   ERC20Abi,
      //   sponsorship
      // )

      const values = await batch(
        provider,
        etherplexPrizeStrategyContract
          .isRngRequested() // used to determine if the pool is locked
          .isRngCompleted()
          .canStartAward()
          .canCompleteAward()
          .prizePeriodRemainingSeconds()
          .estimateRemainingBlocksToPrize(ethers.utils.parseEther('14'))
          // .estimatePrize()
        // etherplexSponsorshipContract
        //   .name()
        //   .symbol()
        //   .totalSupply(),
      )

      return {
        exitRateMantissa: values.prizeStrategy.exitRateMantissa[0],
        creditRateMantissa: values.prizeStrategy.creditRateMantissa[0],
        isRngRequested: values.prizeStrategy.isRngRequested[0],
        isRngCompleted: values.prizeStrategy.isRngCompleted[0],
        canStartAward: values.prizeStrategy.canStartAward[0],
        canCompleteAward: values.prizeStrategy.canCompleteAward[0],
        prizePeriodRemainingSeconds: values.prizeStrategy.prizePeriodRemainingSeconds[0],
        // sponsorshipName: values.sponsorship.name,
        // sponsorshipSymbol: values.sponsorship.symbol,
        // sponsorshipTotalSupply: values.sponsorship.totalSupply,
        loading: false,
      }
    } catch (e) {
      // throw new Error(e)
      throw {
        name: 'fetchExtendedChainData Error',
        message: `Error from Infura was: ${e.message}`
      }
    }

  }
}
