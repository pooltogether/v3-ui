import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'

import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { getPrizeStrategyAbiFromPool } from 'lib/services/getPrizeStrategyAbiFromPool'
import SablierAbi from 'abis/SablierAbi'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import ERC20Abi from 'abis/ERC20Abi'
import { calculateSablierPrize } from 'lib/utils/calculateSablierPrize'

export const fetchPoolChainData = async ({ provider, poolGraphData, chainId }) => {
  try {
    const poolAddress = poolGraphData.poolAddress
    const prizeStrategyAddress = poolGraphData.prizeStrategy.id
    const cTokenAddress = poolGraphData?.compoundPrizePool?.cToken

    const prizePoolContract = contract('prizePool', PrizePoolAbi, poolAddress)
    const prizeStrategyContract = contract(
      'prizeStrategy',
      getPrizeStrategyAbiFromPool(poolGraphData),
      prizeStrategyAddress
    )

    // Split awards bool
    const splitExternalErc20Awards = await _fetchSplitExternalErc20Awards(
      prizeStrategyContract,
      provider
    )

    // Prize Pool & Prize Strategy
    const poolData = await _fetchPoolData(prizePoolContract, prizeStrategyContract, provider)

    // cToken
    let cTokenResult = {}
    if (cTokenAddress) {
      cTokenResult = await _fetchCTokenData(cTokenAddress, provider)
    }

    // Sablier
    const sablierStreamId = poolGraphData?.sablierStream?.id
    let sablierPrize = null
    if (sablierStreamId && CONTRACT_ADDRESSES[chainId].Sablier) {
      sablierPrize = await _fetchSablierStreamData(provider, chainId, sablierStreamId, {
        prizePeriodStartedAt: poolData.prizeStrategy.prizePeriodStartedAt[0],
        prizePeriodSeconds: poolData.prizeStrategy.prizePeriodSeconds[0],
        isRngRequested: poolData.prizeStrategy.isRngRequested[0]
      })
    }

    console.log({
      ...cTokenResult,
      ...poolData,
      splitExternalErc20Awards,
      sablierPrize,
      loading: false
    })

    return {
      ...cTokenResult,
      ...poolData,
      splitExternalErc20Awards,
      sablierPrize,
      loading: false
    }
  } catch (e) {
    throw {
      name: 'fetchPoolChainData Error',
      message: `Error from Infura was: ${e.message}`
    }
  }
}

// TODO: Use contract version detection to load different versioned ABIs
const _fetchSplitExternalErc20Awards = async (prizeStrategyContract, provider) => {
  try {
    const values = await batch(provider, prizeStrategyContract.splitExternalErc20Awards())

    return values.prizeStrategy.splitExternalErc20Awards[0]
  } catch (e) {
    return false
  }
}

const _fetchPoolData = async (prizePoolContract, prizeStrategyContract, provider) => {
  const poolData = await batch(
    provider,
    prizeStrategyContract
      .isRngRequested() // used to determine if the pool is locked
      .isRngCompleted()
      .canStartAward()
      .canCompleteAward()
      .prizePeriodStartedAt()
      .prizePeriodRemainingSeconds()
      .prizePeriodSeconds()
      .tokenListener()
      .estimateRemainingBlocksToPrize(ethers.utils.parseEther('14')),
    prizePoolContract.captureAwardBalance()
  )

  return {
    awardBalance: poolData.prizePool.captureAwardBalance[0],
    isRngRequested: poolData.prizeStrategy.isRngRequested[0],
    isRngCompleted: poolData.prizeStrategy.isRngCompleted[0],
    canStartAward: poolData.prizeStrategy.canStartAward[0],
    canCompleteAward: poolData.prizeStrategy.canCompleteAward[0],
    tokenListener: poolData.prizeStrategy.tokenListener[0],
    prizePeriodSeconds: poolData.prizeStrategy.prizePeriodSeconds[0],
    prizePeriodRemainingSeconds: poolData.prizeStrategy.prizePeriodRemainingSeconds[0],
    estimateRemainingBlocksToPrize: poolData.prizeStrategy.estimateRemainingBlocksToPrize[0]
  }
}

const _fetchCTokenData = async (cTokenAddress, provider) => {
  try {
    const etherplexCTokenContract = contract('cToken', CTokenAbi, cTokenAddress)
    const cTokenValues = await batch(provider, etherplexCTokenContract.supplyRatePerBlock())
    return { supplyRatePerBlock: cTokenValues.cToken.supplyRatePerBlock[0] }
  } catch (e) {
    console.warn(e.message)
    return {}
  }
}

const _fetchSablierStreamData = async (provider, chainId, sablierStreamId, prizeStrategyData) => {
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

    const { amountThisPrizePeriod, amountPerPrizePeriod } = calculateSablierPrize(
      {
        startTime: sablierValues.sablier.getStream.startTime,
        stopTime: sablierValues.sablier.getStream.stopTime,
        ratePerSecond: sablierValues.sablier.getStream.ratePerSecond
      },
      prizeStrategyData
    )

    return {
      amount: ethers.utils.formatUnits(amountThisPrizePeriod, tokenValues.sablierToken.decimals[0]),
      amountUnformatted: amountThisPrizePeriod,
      amountPerPrizePeriod: ethers.utils.formatUnits(
        amountPerPrizePeriod,
        tokenValues.sablierToken.decimals[0]
      ),
      amountPerPrizePeriodUnformatted: amountPerPrizePeriod,
      tokenDecimals: tokenValues.sablierToken.decimals[0],
      tokenName: tokenValues.sablierToken.name[0],
      tokenSymbol: tokenValues.sablierToken.symbol[0],
      tokenAddress: sablierValues.sablier.getStream.tokenAddress,
      startTime: sablierValues.sablier.getStream.startTime,
      stopTime: sablierValues.sablier.getStream.stopTime,
      ratePerSecond: sablierValues.sablier.getStream.ratePerSecond,
      totalDeposit: ethers.utils.formatUnits(
        sablierValues.sablier.getStream.deposit,
        tokenValues.sablierToken.decimals[0]
      ),
      totalDepositUnformatted: sablierValues.sablier.getStream.deposit
    }
  } catch (e) {
    console.warn(e)
    return null
  }
}
