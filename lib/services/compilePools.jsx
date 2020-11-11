import { isEmpty } from 'lodash'

import { POOLS } from 'lib/constants'
import { compilePoolData } from 'lib/services/compilePoolData'

export const compilePools = (poolAddresses, cache, graphPoolData, graphDataLoading, genericChainData) => {
  let pools = []

  if (!graphDataLoading && !isEmpty(genericChainData)) {
    POOLS.forEach(POOL => {
      const _pool = compilePoolData(
        POOL,
        poolAddresses.daiPool,
        cache,
        genericChainData.dai,
        graphPoolData.daiPool,
      )

      if (_pool?.id) {
        pools.push(_pool)
      }
    })
  }

  return pools
}
