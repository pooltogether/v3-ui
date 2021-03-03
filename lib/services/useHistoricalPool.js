import { ethers } from 'ethers'

import { useReadProvider } from 'lib/hooks/useReadProvider'
import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'
import { useLootBox } from 'lib/hooks/useLootBox'
import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'
import { useCommunityPoolAddresses } from 'lib/hooks/useCommunityPoolAddresses'
import { calculateExternalAwardsValue } from 'lib/services/calculateExternalAwardsValue'
import { compileHistoricalErc20Awards } from 'lib/services/compileHistoricalErc20Awards'
import { compileErc721Awards } from 'lib/services/compileErc721Awards'
import { marshallPoolData } from 'lib/services/marshallPoolData'
import { symbolTemplate, nameTemplate } from 'lib/utils/communityPoolStringTemplates'
import { sumAwardedControlledTokens } from 'lib/utils/sumAwardedControlledTokens'
// import { getControlledToken, getSponsorshipTokenAddress, getTicketTokenAddress } from 'lib/services/getPoolDataFromQueryResult'

// This gathers historical data for a pool and prize
//
// It uses the ERC20/721 balances pulled from the pooltogether subgraph as we want the balance
// at the time the prize was awarded, etc (called balanceAwarded)

export const useHistoricalPool = (
  poolInfo,
  poolGraphData,
  poolAddress,
  blockNumber,
  prize,
  splitExternalErc20Awards
) => {
  const { communityPoolAddresses } = useCommunityPoolAddresses()

  // Community Pool:
  if (communityPoolAddresses.includes(poolGraphData?.id)) {
    poolGraphData.isCommunityPool = true
    poolGraphData.name = nameTemplate(poolGraphData)
    poolGraphData.symbol = symbolTemplate(poolGraphData)
  }


  const poolObj = {
    ...poolInfo,
    ...poolGraphData
  }

  const marshalledData = marshallPoolData(poolObj, blockNumber)

  const pool = {
    ...poolObj,
    ...marshalledData
  }

  pool.isStakePrizePool = !pool.compoundPrizePool

  const numOfWinners = parseInt(marshalledData.numberOfWinners || 1, 10)

  // const addresses = marshalledData?.externalErc20Awards?.map(award => award.address)
  let addresses = []
  addresses = poolObj.underlyingCollateralToken && [poolObj.underlyingCollateralToken]

  const {
    data: uniswapPriceData,
    error: uniswapError,
    isFetching: uniswapIsFetching,
    isFetched: uniswapIsFetched,
  } = useUniswapTokensQuery(addresses, blockNumber)
  if (uniswapError) {
    console.error(uniswapError)
  }
  const compiledExternalErc20Awards = compileHistoricalErc20Awards(
    prize,
    numOfWinners,
    splitExternalErc20Awards
  )

  const { readProvider } = useReadProvider()
  const externalErc721Awards = marshalledData?.externalErc721Awards

  const { data: externalErc721ChainData, error: externalErc721ChainError } = useEthereumErc721Query(
    {
      provider: readProvider,
      graphErc721Awards: externalErc721Awards,
      balanceOfAddress: poolAddress,
    }
  )

  if (externalErc721ChainError) {
    console.warn(externalErc721ChainError)
  }

  const compiledExternalErc721Awards = compileErc721Awards(
    externalErc721Awards,
    externalErc721ChainData
  )

  const externalErcAwards = {
    compiledExternalErc20Awards,
    compiledExternalErc721Awards,
  }
  const lootBox = useLootBox(externalErcAwards, blockNumber)

  const externalAwardsUSD = calculateExternalAwardsValue(lootBox.awards)

  const totalAwardedControlledTokensUSD = sumAwardedControlledTokens(prize?.awardedControlledTokens)

  const underlyingCollateralValueUSD = uniswapPriceData?.[pool.underlyingCollateralToken]?.usd

  let ticketPrizeUSD = parseFloat(
    totalAwardedControlledTokensUSD.div(ethers.constants.WeiPerEther).toString()
  )

  if (underlyingCollateralValueUSD) {
    ticketPrizeUSD = (ticketPrizeUSD * parseInt(underlyingCollateralValueUSD * 100, 10)) / 100
  } else {
    // console.warn('could not get USD value for price of underlying collateral token')
  }
  
  const grandPrizeAmountUSD = externalAwardsUSD
    ? ticketPrizeUSD / numOfWinners + externalAwardsUSD
    : ticketPrizeUSD / numOfWinners

  const totalPrizeAmountUSD = externalAwardsUSD
    ? ticketPrizeUSD + externalAwardsUSD
    : ticketPrizeUSD

  const fetchingTotals =
    externalAwardsUSD === null || (ticketPrizeUSD === 0 && uniswapIsFetching && !uniswapIsFetched)

  // Standardize the USD values so they're either all floats/strings or all bigNums
  return {
    ...pool,
    lootBox,
    fetchingTotals,
    totalPrizeAmountUSD,
    grandPrizeAmountUSD,
    ticketPrizeUSD,
    externalAwardsUSD,
    compiledExternalErc20Awards,
    compiledExternalErc721Awards,
  }
}
