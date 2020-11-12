import { ethers } from 'ethers'

import {
  QUERY_KEYS
} from 'lib/constants'

import { calculateExternalAwardsValue } from 'lib/services/calculateExternalAwardsValue'
import { compileHistoricalErc20Awards } from 'lib/services/compileHistoricalErc20Awards'

// This gathers historical data for a pool and prize
//
// It uses the ERC20/721 balances pulled from the pooltogether subgraph as we want the balance
// at the time the prize was awarded, etc (called balanceAwarded)

export const compileTimeTravelPool = (
  poolInfo,
  cache,
  graphPool,
  poolAddress,
  blockNumber,
  interestPrize,
) => {  
  const poolObj = {
    ...poolInfo,
    ...graphPool,
  }

  const uniswapPriceData = cache.getQueryData([QUERY_KEYS.uniswapTokensQuery, poolAddress, blockNumber])

  const externalErc20Awards = compileHistoricalErc20Awards(graphPool, uniswapPriceData)
  const externalErc721Awards = graphPool?.prizeStrategy?.externalErc721Awards

  const externalAwardsValue = calculateExternalAwardsValue(externalErc20Awards)

  const totalPrize = externalAwardsValue ?
    interestPrize.add(ethers.utils.parseEther(
      externalAwardsValue.toString()
    )) :
    interestPrize

  return {
    ...poolInfo,
    ...poolObj,
    poolAddress: poolAddress,
    prizeAmount: totalPrize,
    interestPrize,
    externalAwardsValue,
    // externalItemAwardsValue,
    externalErc20Awards,
    externalErc721Awards
  }
}
