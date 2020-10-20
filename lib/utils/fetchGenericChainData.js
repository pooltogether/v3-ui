import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'
import { isEmpty } from 'lodash'

import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

export const fetchGenericChainData = async (
  provider,
  poolData,
) => {
  const poolAddress = poolData.poolAddress
  console.log({ poolData})
  console.log({ps: poolData.prizeStrategy})
  const prizeStrategyAddress = poolData.prizeStrategy.id
  const cTokenAddress = poolData.compoundPrizePool.cToken

  if (
    provider &&
    prizeStrategyAddress &&
    cTokenAddress &&
    poolAddress &&
    !isEmpty(poolData)
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
        cTokenAddress
      )
      const etherplexPrizePoolContract = contract(
        'prizePool',
        PrizePoolAbi,
        poolAddress
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
        etherplexPrizePoolContract
          .captureAwardBalance()
      )

      return {
        awardBalance: values.prizePool.captureAwardBalance[0],
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
