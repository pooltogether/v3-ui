import { marshallPoolData } from 'lib/services/marshallPoolData'

export const getPoolDataFromQueryResult = (contractAddresses, data) => {
  let poolData = {
    'PT-cDAI': null,
  }

  if (contractAddresses && data?.length > 0) {
    const daiGraphData = data.find(prizePool => contractAddresses?.['PT-cDAI'] === prizePool.id)
    const marshalledData = marshallPoolData(daiGraphData)

    poolData['PT-cDAI'] = { 
      ...daiGraphData,
      ...marshalledData,
    }
  }

  return poolData
}
