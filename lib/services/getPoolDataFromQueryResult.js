import { marshallPoolData } from 'lib/services/marshallPoolData'

import { POOLS } from 'lib/constants'

export const getPoolDataFromQueryResult = (
  chainId,
  contractAddresses,
  version,
  graphPoolsData = []
) => {
  let poolData = {}

  if (POOLS[chainId]?.[version]) {
    POOLS[chainId][version].forEach((poolInfo) => {
      const poolGraphData = graphPoolsData.find(
        (prizePool) => contractAddresses[poolInfo.symbol] === prizePool.id
      )
      const marshalledData = marshallPoolData(poolGraphData)

      poolData[poolInfo.symbol] = {
        ...poolGraphData,
        ...marshalledData
      }
    })
  }

  return poolData
}
