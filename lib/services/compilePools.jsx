import { isEmpty } from 'lodash'

import { POOLS } from 'lib/constants'
import { compilePool } from 'lib/services/compilePool'

export const compilePools = (
  chainId,
  contractAddresses,
  cache,
  graphPoolData,
  genericChainData
) => {
  let pools = []

  if (!isEmpty(genericChainData)) {
  // if (!graphDataLoading && !isEmpty(genericChainData)) {
    POOLS.forEach(POOL => {
      const _pool = compilePool(
        chainId,
        POOL,
        contractAddresses.daiPool,
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
