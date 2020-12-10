import { marshallPoolData } from 'lib/services/marshallPoolData'

export const getPoolDataFromQueryResult = (addresses, data) => {
  let poolData = {
    daiPool: null,
  }

  if (addresses && data?.length > 0) {
    const daiGraphData = data.find(prizePool => addresses.daiPool === prizePool.id)
    const marshalledData = marshallPoolData(daiGraphData)
    console.log(marshalledData)

    poolData.daiPool = { 
      ...daiGraphData,
      ...marshalledData,
      // poolAddress: daiGraphData?.id,
      // // poolAddress: addresses.daiPool,
      // externalErc20Awards,
      // externalErc721Awards,
      // numberOfWinners,
      // playerCount,
      // prizeStrategyType,
      // prizePeriodSeconds,
      // sponsorshipToken,
      // ticketSupply,
      // ticketToken,
      // totalSponsorship
    }
  }

  return poolData
}
