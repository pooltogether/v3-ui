export const getPoolDataFromQueryResult = (addresses, data) => {
  let poolData = {
    daiPool: null,
  }

  if (addresses && data?.length > 0) {
    const daiGraphData = data.find(prizePool => addresses.daiPool === prizePool.id)

    const sponsorshipTokenAddress = getSponsorshipTokenAddress(daiGraphData?.prizeStrategy)
    const ticketTokenAddress = getTicketTokenAddress(daiGraphData?.prizeStrategy)
    const sponsorshipToken = getControlledToken(daiGraphData?.controlledTokens, sponsorshipTokenAddress)
    const ticketToken = getControlledToken(daiGraphData?.controlledTokens, ticketTokenAddress)

    poolData.daiPool = { 
      poolAddress: addresses.daiPool, 
      ...daiGraphData,
      playerCount: daiGraphData?.prizeStrategy?.singleRandomWinner?.ticket?.numberOfHolders,
      ticketSupply: daiGraphData?.prizeStrategy?.singleRandomWinner?.ticket?.totalSupply,
      sponsorshipToken,
      ticketToken,
      numberOfWinners: '7',
    }
  }

  return poolData
}

export const getSponsorshipTokenAddress = (prizeStrategy) => prizeStrategy?.singleRandomWinner?.sponsorship?.id
export const getTicketTokenAddress = (prizeStrategy) => prizeStrategy?.singleRandomWinner?.ticket?.id
export const getControlledToken = (controlledTokens, address) => controlledTokens?.find(ct => ct.id === address)