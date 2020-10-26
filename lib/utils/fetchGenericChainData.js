import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'
import { isEmpty } from 'lodash'

import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

const _getExternalAwardsChainData = async (
  provider,
  poolAddress,
  poolData
) => {
  console.log(poolData)
  console.log(poolData?.externalErc20Awards)
  const poolsExternalErc20AwardsData = {}
  const batchCalls = []
  
  let etherplexTokenContract
  let erc20Address
  let idunno
  let values
  let i
  
  const awards = poolData?.externalErc20Awards?.map(award => award.address)

  // Prepare batched calls
  for (i = 0; i < awards?.length; i++) {
    erc20Address = awards[i]
    etherplexTokenContract = contract(erc20Address, ERC20Abi, erc20Address)

    batchCalls.push(
      etherplexTokenContract
        .balanceOf(poolAddress)
        .name()
        .symbol()
        .decimals()
    )
  }

  console.log({ batchCalls })

  // Execute batched calls
  values = await batch(
    provider,
    ...batchCalls
  )
  console.log({values})

  // Map batch call results to erc20 data
  for (i = 0; i < awards?.length; i++) {
    erc20Address = awards[i]
    etherplexTokenContract = awards[erc20Address]

    // const claimable = usersDripBalances.find(dripBalance => {
    //   return dripBalance.etherplexTokenContract.toLowerCase() === erc20Address.toLowerCase()
    // })
    //   .balance

    poolsExternalErc20AwardsData[erc20Address] = {
      ...etherplexTokenContract,
      name: values[erc20Address].name[0],
      symbol: values[erc20Address].symbol[0],
      decimals: values[erc20Address].decimals[0],
      balance: values[erc20Address].balanceOf[0],
    }
  }

  return poolsExternalErc20AwardsData
}

const _getGenericChainData = async (
  provider,
  prizeStrategyAddress,
  cTokenAddress,
  poolAddress,
) => {
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

export const fetchGenericChainData = async (
  provider,
  externalAwardsData,
  poolData,
) => {
  const poolAddress = poolData.poolAddress
  const prizeStrategyAddress = poolData?.prizeStrategy?.id
  const cTokenAddress = poolData.compoundPrizePool?.cToken

  if (
    provider &&
    prizeStrategyAddress &&
    cTokenAddress &&
    poolAddress &&
    !isEmpty(poolData)
  ) {
    const genericData = _getGenericChainData(
      provider,
      prizeStrategyAddress,
      cTokenAddress,
      poolAddress,
      poolData
    )

    let externalAwardsChainData = {}
    if (externalAwardsChainData) {
      externalAwardsChainData = _getExternalAwardsChainData(
        provider,
        poolAddress,
        poolData
      )
    }

    return {
      ...externalAwardsChainData,
      ...genericData,
    }
  }
}
