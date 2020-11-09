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
) => {
  const poolObj = {
    ...poolChainData,
    ...poolGraphData,
    ...prizeStrategyGraphData
  }

  const externalErc20Awards = cache.getQueryData([QUERY_KEYS.ethereumErc20sQuery, poolAddress])
  const externalErc721Awards = cache.getQueryData([QUERY_KEYS.ethereumErc721sQuery, poolAddress])

  const externalAwardsEstimate = calculateEstimatedExternalAwardsValue(externalErc20Awards)
  const externalItemAwardsEstimate = calculateEstimatedExternalItemAwardsValue(
    externalErc721Awards
  )

  const interestPrizeEstimate = calculateEstimatedPoolPrize(poolObj)

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
    externalErc20ChainData: externalErc20Awards,
    externalErc721ChainData: externalErc721Awards
  }
}
