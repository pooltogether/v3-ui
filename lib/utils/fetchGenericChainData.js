import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'
import { isEmpty } from 'lodash'

import ERC20Abi from 'lib/../abis/ERC20Abi'
import ERC721Abi from '@pooltogether/pooltogether-contracts/abis/ERC721UpgradeSafe'
import CTokenAbi from '@pooltogether/pooltogether-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

import { TOKEN_VALUES } from 'lib/constants'

const debug = require('debug')('pool-app:fetchGenericChainData')

const _getExternalErc20AwardsChainData = async (
  provider,
  externalAwardsGraphData,
  poolAddress,
  coingeckoData,
) => {
  const poolsExternalErc20AwardsData = []
  const batchCalls = []
  
  let etherplexTokenContract
  let erc20Address
  let values
  let i
  
  const awards = externalAwardsGraphData?.map(award => award.address)

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

  // Execute batched calls
  values = await batch(
    provider,
    ...batchCalls
  )

  // Map batch call results to erc20 data
  for (i = 0; i < awards?.length; i++) {
    erc20Address = awards[i]
    etherplexTokenContract = awards[erc20Address]

    const decimals = values[erc20Address].decimals[0]
    const balance = values[erc20Address].balanceOf[0]

    let value
    if (!isEmpty(coingeckoData)) {
      const priceData = coingeckoData[erc20Address]
      const priceUsd = priceData ? priceData?.usd : TOKEN_VALUES[erc20Address]

      const balanceFormatted = ethers.utils.formatUnits(balance, decimals)

      value = priceUsd && parseFloat(balanceFormatted) * priceUsd
    }

    poolsExternalErc20AwardsData.push({
      ...etherplexTokenContract,
      address: erc20Address,
      name: values[erc20Address].name[0],
      symbol: values[erc20Address].symbol[0],
      decimals,
      balance,
      value,
    })
  }

  return poolsExternalErc20AwardsData
}

const _getExternalErc721ItemAwardsChainData = async (
  provider,
  externalErc721Awards,
  poolAddress,
) => {
  const poolsExternalErc721AwardsData = []
  const batchCalls = []

  let etherplexTokenContract
  let values
  let i, j

  // console.log('***********************')

  // Prepare batched calls
  for (i = 0; i < externalErc721Awards?.length; i++) {
    const award = externalErc721Awards[i]
    const erc721Address = award.address

    etherplexTokenContract = contract(erc721Address, ERC721Abi, erc721Address)

    batchCalls.push(
      etherplexTokenContract
        .balanceOf(poolAddress)
        // .tokenURI(tokenId)
        .name()
        .symbol()
    )

        // TODO: split up the batching so we can query if metadata is supported by each NFT
    //       or better yet, store the check to see if tokenURI is implemented on the Subgraph
    // const tokenId = externalErc721Awards[i].tokenIds[0]
    for (j = 0; j < award.tokenIds?.length; j++) {
      const tokenId = award.tokenIds[j]
      // console.log(tokenId)

      batchCalls.push(
        etherplexTokenContract
          .tokenURI(tokenId)
      )
    }
  }

  // Execute batched calls
  values = await batch(
    provider,
    ...batchCalls
  )

  // console.log(values)

  // Map batch call results to erc20 data
  for (i = 0; i < externalErc721Awards?.length; i++) {
    const award = externalErc721Awards[i]
    const erc721Address = award.address

    // const decimals = values[erc721Address].decimals[0]
    const balance = values[erc721Address].balanceOf[0]

    let value
    // if (!isEmpty(coingeckoData)) {
    //   const priceData = coingeckoData[erc721Address]
    //   const priceUsd = priceData ? priceData?.usd : TOKEN_VALUES[erc721Address]

    //   const balanceFormatted = ethers.utils.formatUnits(balance, decimals)

    //   value = priceUsd && parseFloat(balanceFormatted) * priceUsd
    // }

    for (j = 0; j < award.tokenIds?.length; j++) {
      const tokenId = award.tokenIds[j]
      // console.log('handle me')

      // batchCalls.push(
      //   etherplexTokenContract
      //     .tokenURI(tokenId)
      // )
    }
    

    poolsExternalErc721AwardsData.push({
      ...award,
      address: erc721Address,
      name: values[erc721Address].name[0],
      symbol: values[erc721Address].symbol[0],
      // decimals,
      balance,
      value,
    })
  }

  // console.log(poolsExternalErc721AwardsData)

  return poolsExternalErc721AwardsData
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
  externalAwardsGraphData,
  poolData,
  coingeckoData,
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
    const genericData = await _getGenericChainData(
      provider,
      prizeStrategyAddress,
      cTokenAddress,
      poolAddress,
      poolData
    )

    let externalErc20AwardsChainData = null
    if (!isEmpty(externalAwardsGraphData)) {
      externalErc20AwardsChainData = await _getExternalErc20AwardsChainData(
        provider,
        externalAwardsGraphData.externalErc20Awards,
        poolAddress,
        coingeckoData
      )
    }
    
    let externalErc721AwardsChainData = null
    if (!isEmpty(externalAwardsGraphData)) {
      externalErc721AwardsChainData = await _getExternalErc721ItemAwardsChainData(
        provider,
        externalAwardsGraphData.externalErc721Awards,
        poolAddress,
      )
    }

    return {
      externalErc20AwardsChainData,
      externalErc721AwardsChainData,
      ...genericData,
    }
  }
}
