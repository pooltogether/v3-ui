import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'
import { isEmpty } from 'lodash'

import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

export const fetchGenericChainData = async (
  provider,
  prizeStrategyAddress,
  poolData,
) => {
  if (
    provider &&
    prizeStrategyAddress &&
    !isEmpty(poolData)
  ) {

    // console.log('******************************************')
    // console.log({ ctoken: poolData.compoundPrizePool.cToken})
    // console.log({ prizeStrategyAddress})
    try {
      const etherplexPrizeStrategyContract = contract(
        'prizeStrategy',
        SingleRandomWinnerAbi,
        prizeStrategyAddress
      )
      const etherplexCTokenContract = contract(
        'cToken',
        CTokenAbi,
        poolData.compoundPrizePool.cToken
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
          .decimals()
          .supplyRatePerBlock(),
      )
      // console.log({ decimals: values.cToken.decimals[0]})
      // console.log({ supplyRatePerBlock: values.cToken.supplyRatePerBlock.toString()})

      return {
        isRngRequested: values.prizeStrategy.isRngRequested[0],
        isRngCompleted: values.prizeStrategy.isRngCompleted[0], // do we need this?
        canStartAward: values.prizeStrategy.canStartAward[0],
        canCompleteAward: values.prizeStrategy.canCompleteAward[0],
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
