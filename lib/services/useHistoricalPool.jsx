import { ethers } from 'ethers'

import {
  QUERY_KEYS
} from 'lib/constants'

import { useReadProvider } from 'lib/hooks/useReadProvider'
import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'
import { useLootBox } from 'lib/hooks/useLootBox'
import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'
import { calculateExternalAwardsValue } from 'lib/services/calculateExternalAwardsValue'
import { compileHistoricalErc20Awards } from 'lib/services/compileHistoricalErc20Awards'
import { compileErc721Awards } from 'lib/services/compileErc721Awards'
import { marshallPoolData } from 'lib/services/marshallPoolData'
import { sumAwardedControlledTokens } from 'lib/utils/sumAwardedControlledTokens'
// import { getControlledToken, getSponsorshipTokenAddress, getTicketTokenAddress } from 'lib/services/getPoolDataFromQueryResult'

// This gathers historical data for a pool and prize
//
// It uses the ERC20/721 balances pulled from the pooltogether subgraph as we want the balance
// at the time the prize was awarded, etc (called balanceAwarded)

export const useHistoricalPool = (
  chainId,
  poolInfo,
  cache,
  graphPool,
  poolAddress,
  blockNumber,
  prize,
) => {
  const poolObj = {
    ...poolInfo,
    ...graphPool,
  }
  
  const marshalledData = marshallPoolData(poolObj, blockNumber)

  const pool = {
    ...poolObj,
    ...marshalledData
  }



  const numOfWinners = parseInt(marshalledData.numberOfWinners || 1, 10)
  
  const addresses = marshalledData?.externalErc20Awards?.map(award => award.address)

  if (addresses) {
    addresses.push(poolObj.underlyingCollateralToken)
  }

  const {
    data: uniswapPriceData,
    error: uniswapError,
    isFetching: uniswapIsFetching,
    isFetched: uniswapIsFetched
  } = useUniswapTokensQuery(
    addresses,
    blockNumber
  )
  if (uniswapError) {
    console.error(uniswapError)
  }
  const compiledExternalErc20Awards = compileHistoricalErc20Awards(prize, uniswapPriceData)




  const { readProvider } = useReadProvider()
  const externalErc721Awards = marshalledData?.externalErc721Awards

  const {
    data: externalErc721ChainData,
    error: externalErc721ChainError,
  } = useEthereumErc721Query({
    provider: readProvider,
    graphErc721Awards: externalErc721Awards,
    poolAddress,
  })

  if (externalErc721ChainError) {
    console.warn(externalErc721ChainError)
  }

  const compiledExternalErc721Awards = compileErc721Awards(externalErc721Awards, externalErc721ChainData)



  const externalErcAwards = {
    compiledExternalErc20Awards,
    compiledExternalErc721Awards,
  }
  let {
    awards,
    lootBoxAwards,
    computedLootBoxAddress,
    lootBoxIsFetching,
    lootBoxIsFetched
  } = useLootBox(externalErcAwards, blockNumber)

  const externalAwardsUSD = calculateExternalAwardsValue(compiledExternalErc20Awards)
  
  const totalAwardedControlledTokensUSD = sumAwardedControlledTokens(prize?.awardedControlledTokens)

  const underlyingCollateralValueUSD = uniswapPriceData?.[pool.underlyingCollateralToken]?.usd



  let interestPrizeUSD = parseFloat(
    totalAwardedControlledTokensUSD.div(ethers.constants.WeiPerEther).toString()
  )


  if (underlyingCollateralValueUSD) {
    interestPrizeUSD = interestPrizeUSD *
      parseInt((underlyingCollateralValueUSD * 100), 10) /
      100
  } else {
    // console.warn('could not get USD value for price of underlying collateral token')
  }



  const grandPrizeAmountUSD = externalAwardsUSD ?
    (interestPrizeUSD / numOfWinners) +
      externalAwardsUSD :
    (interestPrizeUSD / numOfWinners)


  const totalPrizeAmountUSD = externalAwardsUSD ?
    interestPrizeUSD + externalAwardsUSD :
    interestPrizeUSD * numOfWinners

  const fetchingTotals = externalAwardsUSD === null ||
    interestPrizeUSD === 0 &&
    (uniswapIsFetching && !uniswapIsFetched)

  // Standardize the USD values so they're either all floats/strings or all bigNums
  return {
    ...pool,
    awards,
    lootBoxAwards,
    computedLootBoxAddress,
    fetchingTotals,
    totalPrizeAmountUSD,
    grandPrizeAmountUSD,
    interestPrizeUSD,
    externalAwardsUSD,
    compiledExternalErc20Awards,
    compiledExternalErc721Awards,
  }
}