import { ethers } from 'ethers'

import {
  QUERY_KEYS
} from 'lib/constants'

import { calculateEstimatedPoolPrize } from 'lib/services/calculateEstimatedPoolPrize'
import { calculateEstimatedExternalAwardsValue } from 'lib/services/calculateEstimatedExternalAwardsValue'
// import { calculateEstimatedExternalItemAwardsValue } from 'lib/services/calculateEstimatedExternalItemAwardsValue'
import { compileErc20Awards } from 'lib/services/compileErc20Awards'
import { compileErc721Awards } from 'lib/services/compileErc721Awards'


// this gathers the current data for a pool
// note: when calculating value of ERC20 tokens this uses current chain data (infura/alchemy) to get the balance
// but uses the Uniswap subgraph to get the prices
// 
// in the compilePoolWithBlockNumber(), the balance is pulled from the pooltogether subgraph as we want the balance
// at the time the prize was awarded, etc

export const compilePoolData = (
  poolInfo,
  poolAddress,
  cache,
  poolChainData,
  poolGraphData,
) => {
  const poolObj = {
    ...poolChainData,
    ...poolGraphData,
  }

  const uniswapPriceData = cache.getQueryData([QUERY_KEYS.uniswapTokensQuery, poolAddress, -1])
  const ethereumErc20Awards = cache.getQueryData([QUERY_KEYS.ethereumErc20sQuery, poolAddress])
  const ethereumErc721Awards = cache.getQueryData([QUERY_KEYS.ethereumErc721sQuery, poolAddress])

  const externalErc20Awards = compileErc20Awards(ethereumErc20Awards, poolGraphData, uniswapPriceData)
  const externalErc721Awards = compileErc721Awards(ethereumErc721Awards, poolGraphData)

  const externalAwardsEstimateUSD = calculateEstimatedExternalAwardsValue(externalErc20Awards)
  // const externalItemAwardsEstimate = calculateEstimatedExternalItemAwardsValue(
  //   ethereumErc721Awards
  // )

  const interestPrizeEstimate = calculateEstimatedPoolPrize(poolObj)

  const totalPrizeEstimate = externalAwardsEstimateUSD ?
    interestPrizeEstimate.add(ethers.utils.parseEther(
      externalAwardsEstimateUSD.toString()
    )) :
    interestPrizeEstimate

  return {
    ...poolInfo,
    ...poolObj,
    prizeEstimate: totalPrizeEstimate,
    interestPrizeEstimate,
    externalAwardsEstimateUSD,
    // externalItemAwardsEstimate,
    externalErc20Awards,
    externalErc721Awards
  }
}
