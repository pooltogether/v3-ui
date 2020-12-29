import { ethers } from 'ethers'

import {
  QUERY_KEYS
} from 'lib/constants'

import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'
import { calculateExternalAwardsValue } from 'lib/services/calculateExternalAwardsValue'
import { compileHistoricalErc20Awards } from 'lib/services/compileHistoricalErc20Awards'
import { compileHistoricalErc721Awards } from 'lib/services/compileHistoricalErc721Awards'
import { marshallPoolData } from 'lib/services/marshallPoolData'
import { sumAwardedControlledTokens } from 'lib/utils/sumAwardedControlledTokens'
import { useLootBox } from 'lib/hooks/useLootBox'
// import { getControlledToken, getSponsorshipTokenAddress, getTicketTokenAddress } from 'lib/services/getPoolDataFromQueryResult'

// This gathers historical data for a pool and prize
//
// It uses the ERC20/721 balances pulled from the pooltogether subgraph as we want the balance
// at the time the prize was awarded, etc (called balanceAwarded)

export const compileHistoricalPool = (
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

  const ethErc721Awards = cache.getQueryData([
    QUERY_KEYS.ethereumErc721sQuery,
    chainId,
    poolAddress,
    blockNumber
  ])
  const compiledExternalErc721Awards = compileHistoricalErc721Awards(ethErc721Awards, prize)



  const pool = {
    ...poolInfo,
    ...poolObj,
    ...marshalledData
  }

  const historical = blockNumber > -1
  let { awards, lootBoxIsFetching, lootBoxIsFetched } = useLootBox(
    historical,
    pool,
    {
      compiledExternalErc20Awards,
      compiledExternalErc721Awards,
    },
    blockNumber
  )




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
    fetchingTotals,
    totalPrizeAmountUSD,
    grandPrizeAmountUSD,
    interestPrizeUSD,
    externalAwardsUSD,
    compiledExternalErc20Awards,
    compiledExternalErc721Awards,
    ethErc721Awards,
  }
}
