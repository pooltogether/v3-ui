import { isEmpty } from 'lodash'

import { POOLS } from 'lib/constants'
import { compilePool } from 'lib/services/compilePool'

export const compilePools = (poolAddresses, cache, graphPoolData, graphDataLoading, genericChainData) => {
  let pools = []

  if (!graphDataLoading && !isEmpty(genericChainData)) {
    POOLS.forEach(POOL => {
      const _pool = compilePool(
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
