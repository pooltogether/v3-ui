import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'

import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { getPrizeStrategyAbiFromPool } from 'lib/services/getPrizeStrategyAbiFromPool'

const debug = require('debug')('pool-app:fetchPoolChainData')

export const fetchPoolChainData = async ({ provider, poolGraphData }) => {
  const poolAddress = poolGraphData.poolAddress
  const prizeStrategyAddress = poolGraphData.prizeStrategy.id
  const cTokenAddress = poolGraphData?.compoundPrizePool?.cToken

  try {
    const etherplexPrizeStrategyContract = contract(
      'prizeStrategy',
      getPrizeStrategyAbiFromPool(poolGraphData),
      prizeStrategyAddress
    )
    
    const etherplexPrizePoolContract = contract('prizePool', PrizePoolAbi, poolAddress)

    const values = await batch(
      provider,
      etherplexPrizeStrategyContract
        .isRngRequested() // used to determine if the pool is locked
        .isRngCompleted()
        .canStartAward()
        .canCompleteAward()
        .prizePeriodRemainingSeconds()
        .tokenListener()
        .estimateRemainingBlocksToPrize(ethers.utils.parseEther('14')),
      etherplexPrizePoolContract.captureAwardBalance()
    )

    let cTokenResult = {}
    if (cTokenAddress) {
      const etherplexCTokenContract = contract('cToken', CTokenAbi, cTokenAddress)
      const cTokenValues = await batch(
        provider,
        etherplexCTokenContract.supplyRatePerBlock(),
      )
      cTokenResult = { supplyRatePerBlock: cTokenValues.cToken.supplyRatePerBlock[0] }
    }

    return {
      ...cTokenResult,
      awardBalance: values.prizePool.captureAwardBalance[0],
      isRngRequested: values.prizeStrategy.isRngRequested[0],
      isRngCompleted: values.prizeStrategy.isRngCompleted[0], // do we need this?
      canStartAward: values.prizeStrategy.canStartAward[0],
      canCompleteAward: values.prizeStrategy.canCompleteAward[0],
      tokenListener: values.prizeStrategy.tokenListener[0],
      prizePeriodRemainingSeconds: values.prizeStrategy.prizePeriodRemainingSeconds[0],
      estimateRemainingBlocksToPrize: values.prizeStrategy.estimateRemainingBlocksToPrize[0],
      loading: false,
    }
  } catch (e) {
    throw {
      name: 'fetchPoolChainData Error',
      message: `Error from Infura was: ${e.message}`,
    }
  }
}
