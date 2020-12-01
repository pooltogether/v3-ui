import { ethers } from 'ethers'

import {
  QUERY_KEYS
} from 'lib/constants'

import { calculateExternalAwardsValue } from 'lib/services/calculateExternalAwardsValue'
import { compileHistoricalErc20Awards } from 'lib/services/compileHistoricalErc20Awards'
import { compileHistoricalErc721Awards } from 'lib/services/compileHistoricalErc721Awards'

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
  const interestPrizeUSD = ethers.utils.bigNumberify(prize?.amount || 0)

  const poolObj = {
    ...poolInfo,
    ...graphPool,
  }

  const uniswapPriceData = cache.getQueryData([
    QUERY_KEYS.uniswapTokensQuery,
    chainId,
    poolAddress,
    blockNumber
  ])
  const externalErc20Awards = compileHistoricalErc20Awards(prize, uniswapPriceData)

  const ethErc721Awards = cache.getQueryData([
    QUERY_KEYS.ethereumErc721sQuery,
    chainId,
    poolAddress,
    blockNumber
  ])
  const externalErc721Awards = compileHistoricalErc721Awards(ethErc721Awards, prize)

  const externalAwardsUSD = calculateExternalAwardsValue(externalErc20Awards)

  const totalPrizeUSD = externalAwardsUSD ?
    interestPrizeUSD.add(ethers.utils.parseEther(
      externalAwardsUSD.toString()
    )) :
    interestPrizeUSD

  return {
    ...poolInfo,
    ...poolObj,
    poolAddress: poolAddress,
    prizeAmountUSD: totalPrizeUSD,
    interestPrizeUSD,
    externalAwardsUSD,
    // externalItemAwardsValue,
    externalErc20Awards,
    externalErc721Awards,
    ethErc721Awards
  }
}
