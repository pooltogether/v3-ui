import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'

import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import RegistryAbi from '@pooltogether/pooltogether-contracts/abis/Registry'
import ReserveAbi from '@pooltogether/pooltogether-contracts/abis/Reserve'

import { getPrizeStrategyAbiFromPool } from 'lib/services/getPrizeStrategyAbiFromPool'
import SablierAbi from 'abis/SablierAbi'
import { CONTRACT_ADDRESSES, DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import ERC20Abi from 'abis/ERC20Abi'
import { calculateSablierPrize } from 'lib/utils/calculateSablierPrize'

export const fetchPoolChainData = async ({ provider, poolGraphData, chainId }) => {
  try {
    const poolAddress = poolGraphData.poolAddress
    const prizeStrategyAddress = poolGraphData.prizeStrategy.id
    const reserveRegistryAddress = poolGraphData.reserveRegistry
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

    // Reserve Rate
    let reserveRate = ethers.constants.Zero

    // TODO: There's a bug with the graph so we're returning the zero address for some pools,
    // at the moment (Mar 17 2021) they're all 0x3e8b9901dbfe766d3fe44b36c180a1bca2b9a295,
    // but in the future that can change (and probably will)
    const tempReserveAddress =
      reserveRegistryAddress === ethers.constants.AddressZero
        ? '0x3e8b9901dbfe766d3fe44b36c180a1bca2b9a295'
        : reserveRegistryAddress

    if (reserveRegistryAddress !== ethers.constants.AddressZero) {
      reserveRate = await _fetchReserveRate(provider, tempReserveAddress)
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

    return {
      ...cTokenResult,
      ...poolData,
      reserveRate,
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
    prizePoolContract.captureAwardBalance().reserveTotalSupply()
  )

  return {
    ...poolData,
    awardBalance: poolData.prizePool.captureAwardBalance[0],
    reserveTotalSupply: poolData.prizePool.reserveTotalSupply[0],
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

const _fetchReserveRate = async (provider, reserveRegistryAddress) => {
  try {
    const registryContract = contract('registryData', RegistryAbi, reserveRegistryAddress)
    const { registryData } = await batch(provider, registryContract.lookup())
    const reserveAddress = registryData.lookup[0].toLowerCase()

    const reserveContract = contract('reserveData', ReserveAbi, reserveAddress)
    const { reserveData } = await batch(provider, reserveContract.rateMantissa())
    return reserveData.rateMantissa[0]
  } catch (e) {
    console.warn(e)
    return ethers.constants.Zero
  }
}
