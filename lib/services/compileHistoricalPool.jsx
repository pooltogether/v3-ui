import { ethers } from 'ethers'

import {
  QUERY_KEYS
} from 'lib/constants'

import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'
import { calculateExternalAwardsValue } from 'lib/services/calculateExternalAwardsValue'
import { compileHistoricalErc20Awards } from 'lib/services/compileHistoricalErc20Awards'
import { compileHistoricalErc721Awards } from 'lib/services/compileHistoricalErc721Awards'
import { marshallPoolData } from 'lib/services/marshallPoolData'
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
  const interestPrizeUSD = ethers.utils.bigNumberify(prize?.amount || 0).mul(numOfWinners)
  
  const addresses = marshalledData?.externalErc20Awards?.map(award => award.address)

  const { status, data, error, isFetching } = useUniswapTokensQuery(
    addresses,
    blockNumber
  )
  const uniswapPriceData = data
  const compiledExternalErc20Awards = compileHistoricalErc20Awards(prize, uniswapPriceData)

  const ethErc721Awards = cache.getQueryData([
    QUERY_KEYS.ethereumErc721sQuery,
    chainId,
    poolAddress,
    blockNumber
  ])
  const compiledExternalErc721Awards = compileHistoricalErc721Awards(ethErc721Awards, prize)

  const externalAwardsUSD = calculateExternalAwardsValue(compiledExternalErc20Awards)

  const grandPrizeAmountUSD = externalAwardsUSD ?
    interestPrizeUSD.div(numOfWinners).add(ethers.utils.parseEther(
      externalAwardsUSD.toString()
    )) :
    interestPrizeUSD

  const totalPrizeAmountUSD = externalAwardsUSD ?
    interestPrizeUSD.add(ethers.utils.parseEther(
      externalAwardsUSD.toString()
    )) :
    interestPrizeUSD.mul(numOfWinners)


  return {
    ...poolInfo,
    ...poolObj,
    ...marshalledData,
    totalPrizeAmountUSD,
    grandPrizeAmountUSD,
    interestPrizeUSD,
    externalAwardsUSD,
    compiledExternalErc20Awards,
    compiledExternalErc721Awards,
    ethErc721Awards,
  }
}
