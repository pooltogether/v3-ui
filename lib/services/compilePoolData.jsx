import {
  QUERY_KEYS
} from 'lib/constants'

import { calculateEstimatedPoolPrize } from 'lib/services/calculateEstimatedPoolPrize'
import { calculateEstimatedExternalAwardsValue } from 'lib/services/calculateEstimatedExternalAwardsValue'
import { calculateEstimatedExternalItemAwardsValue } from 'lib/services/calculateEstimatedExternalItemAwardsValue'

export const compilePoolData = (
  poolInfo,
  poolAddress,
  cache,
  poolChainData,
  poolGraphData,
  prizeStrategyGraphData,
  external721ChainData
) => {
  const externalErc20Awards = cache.getQueryData([QUERY_KEYS.ethereumErc20s, poolAddress])
  // console.log({externalErc20Awards})

  const externalAwardsEstimate = calculateEstimatedExternalAwardsValue(externalErc20Awards)
  const externalItemAwardsEstimate = null
  // const externalItemAwardsEstimate = calculateEstimatedExternalItemAwardsValue(
  //   external721ChainData?.dai
  // )

  const poolObj = {
    ...poolChainData,
    ...poolGraphData,
    ...prizeStrategyGraphData
  }
  const interestPrizeEstimate = calculateEstimatedPoolPrize(poolObj
    // {
    // ...genericChainData.dai,
    // ...dynamicPoolData.daiPool,
    // ...dynamicPrizeStrategiesData.daiPrizeStrategy,
    // }
  )

  const totalPrizeEstimate = externalAwardsEstimate ?
    interestPrizeEstimate.add(ethers.utils.parseEther(
      externalAwardsEstimate.toString()
    )) :
    interestPrizeEstimate

  return {
    ...poolInfo,
    ...poolObj,
    prizeEstimate: totalPrizeEstimate,
    interestPrizeEstimate,
    externalAwardsEstimate,
    externalItemAwardsEstimate,
    external20ChainData: externalErc20Awards,
    external721ChainData: external721ChainData?.dai,
  }
}