import { isEmpty } from 'lodash'

import { POOLS } from 'lib/constants'
import { compilePool } from 'lib/services/compilePool'

export const compilePools = (
  chainId,
  contractAddresses,
  queryCache,
  graphPoolData,
  poolChainData
) => {
  let pools = []

  if (!isEmpty(poolChainData)) {
  // if (!graphDataLoading && !isEmpty(poolChainData)) {
    POOLS.forEach(POOL => {
      const _pool = compilePool(
        chainId,
        POOL,
        contractAddresses.daiPool,
        queryCache,
        poolChainData.dai,
        graphPoolData.daiPool,
      )

      if (_pool?.id) {
        pools.push(_pool)
      }
    })
  }

  return pools
}
