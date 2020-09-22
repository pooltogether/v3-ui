import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'

import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

export const fetchGenericChainData = async (
  provider,
  prizeStrategyAddress,
  poolData,
) => {
  if (
    provider &&
    prizeStrategyAddress
  ) {

    try {
      const etherplexPrizeStrategyContract = contract(
        'prizeStrategy',
        SingleRandomWinnerAbi,
        prizeStrategyAddress
      )
      const etherplexCTokenContract = contract(
        'cToken',
        CTokenAbi,
        poolData.yieldToken
      )

      const values = await batch(
        provider,
        etherplexPrizeStrategyContract
          .isRngRequested() // used to determine if the pool is locked
          .isRngCompleted()
          .canStartAward()
          .canCompleteAward()
          .prizePeriodRemainingSeconds()
          .estimateRemainingBlocksToPrize(ethers.utils.parseEther('14')),
        etherplexCTokenContract
          .supplyRatePerBlock(),
      )

      // // TODO:
      // // get cToken - pull in supply rate per block
      // // estimatePrize = principalAmount * supply rate per block * blocks

      // // lib to estimate prize of a given prizepool

      // const principal = ethers.utils.parseEther(poolData.totalSupply).add(poolData.totalSponsorship)
      // console.log({principal: principal.toString()})

      // const supplyRatePerBlock = values.cToken.supplyRatePerBlock[0]
      // console.log({supplyRatePerBlock: supplyRatePerBlock.toString()})

      // const remainingBlocks = values.prizeStrategy.estimateRemainingBlocksToPrize[0]
      // console.log({remainingBlocks: remainingBlocks.toString()})

      // const estimatePrize = principal.mul(supplyRatePerBlock).mul(remainingBlocks)
      // console.log({estimatePrize: estimatePrize.toString()})

      return {
        isRngRequested: values.prizeStrategy.isRngRequested[0],
        isRngCompleted: values.prizeStrategy.isRngCompleted[0], // do we need this?
        canStartAward: values.prizeStrategy.canStartAward[0],
        canCompleteAward: values.prizeStrategy.canCompleteAward[0],
        // estimatePrize: estimatePrize,
        supplyRatePerBlock: values.cToken.supplyRatePerBlock[0],
        prizePeriodRemainingSeconds: values.prizeStrategy.prizePeriodRemainingSeconds[0],
        estimateRemainingBlocksToPrize: values.prizeStrategy.estimateRemainingBlocksToPrize[0],
        loading: false,
      }
    } catch (e) {
      throw {
        name: 'fetchGenericChainData Error',
        message: `Error from Infura was: ${e.message}`
      }
    }

  }
}
