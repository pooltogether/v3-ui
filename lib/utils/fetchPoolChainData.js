import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'

import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { getPrizeStrategyAbiFromPool } from 'lib/services/getPrizeStrategyAbiFromPool'
import SablierAbi from 'abis/SablierAbi'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import ERC20Abi from 'abis/ERC20Abi'
import { calculateSablierPrize } from 'lib/utils/calculateSablierPrize'

const debug = require('debug')('pool-app:fetchPoolChainData')

// use contract version detection to load different versioned ABIs
const _fetchSplitExternalErc20Awards = async (etherplexPrizeStrategyContract, provider) => {
  try {
    const values = await batch(provider, etherplexPrizeStrategyContract.splitExternalErc20Awards())

    return values.prizeStrategy.splitExternalErc20Awards[0]
  } catch (e) {
    return false
  }
}

export const fetchPoolChainData = async ({ provider, poolGraphData, chainId }) => {
  const poolAddress = poolGraphData.poolAddress
  const prizeStrategyAddress = poolGraphData.prizeStrategy.id
  const cTokenAddress = poolGraphData?.compoundPrizePool?.cToken

  const etherplexPrizeStrategyContract = contract(
    'prizeStrategy',
    getPrizeStrategyAbiFromPool(poolGraphData),
    prizeStrategyAddress
  )

  const etherplexPrizePoolContract = contract('prizePool', PrizePoolAbi, poolAddress)

  const splitExternalErc20Awards = await _fetchSplitExternalErc20Awards(
    etherplexPrizeStrategyContract,
    provider
  )

  try {
    const values = await batch(
      provider,
      etherplexPrizeStrategyContract
        .isRngRequested() // used to determine if the pool is locked
        .isRngCompleted()
        .canStartAward()
        .canCompleteAward()
        .prizePeriodStartedAt()
        .prizePeriodRemainingSeconds()
        .prizePeriodSeconds()
        .tokenListener()
        .estimateRemainingBlocksToPrize(ethers.utils.parseEther('14')),
      etherplexPrizePoolContract.captureAwardBalance()
    )

    let cTokenResult = {}
    if (cTokenAddress) {
      const etherplexCTokenContract = contract('cToken', CTokenAbi, cTokenAddress)
      const cTokenValues = await batch(provider, etherplexCTokenContract.supplyRatePerBlock())
      cTokenResult = { supplyRatePerBlock: cTokenValues.cToken.supplyRatePerBlock[0] }
    }

    // Sablier Prize Data
    const sablierStreamId = poolGraphData?.sablierStream?.id
    let sablierAwardForPrizePeriod
    if (sablierStreamId && CONTRACT_ADDRESSES[chainId].Sablier) {
      try {
        const sablierContract = contract('sablier', SablierAbi, CONTRACT_ADDRESSES[chainId].Sablier)
        const sablierValues = await batch(
          provider,
          sablierContract.getStream(ethers.BigNumber.from(sablierStreamId))
        )
        const tokenContract = contract(
          'sablierToken',
          ERC20Abi,
          sablierValues.sablier.getStream.tokenAddress
        )
        const tokenValues = await batch(provider, tokenContract.decimals().symbol().name())

        const sablierPrizeAmount = calculateSablierPrize(
          {
            startTime: sablierValues.sablier.getStream.startTime,
            stopTime: sablierValues.sablier.getStream.stopTime,
            ratePerSecond: sablierValues.sablier.getStream.ratePerSecond
          },
          {
            prizePeriodStartedAt: values.prizeStrategy.prizePeriodStartedAt[0],
            prizePeriodSeconds: values.prizeStrategy.prizePeriodSeconds[0],
            isRngRequested: values.prizeStrategy.isRngRequested[0]
          }
        )

        sablierAwardForPrizePeriod = {
          amount: ethers.utils.formatUnits(
            sablierPrizeAmount,
            tokenValues.sablierToken.decimals[0]
          ),
          amountUnformatted: sablierPrizeAmount,
          tokenDecimals: tokenValues.sablierToken.decimals[0],
          tokenName: tokenValues.sablierToken.name[0],
          tokenSymbol: tokenValues.sablierToken.symbol[0],
          tokenAddress: sablierValues.sablier.getStream.tokenAddress
        }
      } catch (e) {
        console.warn(e)
      }
    }

    return {
      ...cTokenResult,
      splitExternalErc20Awards,
      sablierPrize: sablierAwardForPrizePeriod,
      awardBalance: values.prizePool.captureAwardBalance[0],
      isRngRequested: values.prizeStrategy.isRngRequested[0],
      isRngCompleted: values.prizeStrategy.isRngCompleted[0], // do we need this?
      canStartAward: values.prizeStrategy.canStartAward[0],
      canCompleteAward: values.prizeStrategy.canCompleteAward[0],
      tokenListener: values.prizeStrategy.tokenListener[0],
      prizePeriodRemainingSeconds: values.prizeStrategy.prizePeriodRemainingSeconds[0],
      estimateRemainingBlocksToPrize: values.prizeStrategy.estimateRemainingBlocksToPrize[0],
      loading: false
    }
  } catch (e) {
    throw {
      name: 'fetchPoolChainData Error',
      message: `Error from Infura was: ${e.message}`
    }
  }
}
