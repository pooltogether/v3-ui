export const getPoolDataFromQueryResult = (addresses, data) => {
  let poolData = {
    daiPool: null,
  }

  if (addresses && data?.length > 0) {
    const dynamicDaiData = data.find(prizePool => addresses.daiPool === prizePool.id)

    const sponsorshipTokenAddress = getSponsorshipTokenAddress(dynamicDaiData?.prizeStrategy)
    const ticketTokenAddress = getTicketTokenAddress(dynamicDaiData?.prizeStrategy)
    const sponsorshipToken = getControlledToken(dynamicDaiData?.controlledTokens, sponsorshipTokenAddress)
    const ticketToken = getControlledToken(dynamicDaiData?.controlledTokens, ticketTokenAddress)

    poolData.daiPool = { 
      poolAddress: addresses.daiPool, 
      ...poolData.daiPool, 
      ...dynamicDaiData,
      playerCount: dynamicDaiData?.prizeStrategy?.singleRandomWinner?.ticket?.numberOfHolders,
      totalSupply: dynamicDaiData?.prizeStrategy?.singleRandomWinner?.ticket?.totalSupply,
      sponsorshipToken,
      ticketToken
    }
  }

  return poolData
}

const getSponsorshipTokenAddress = (prizeStrategy) => prizeStrategy?.singleRandomWinner?.sponsorship?.id
const getTicketTokenAddress = (prizeStrategy) => prizeStrategy?.singleRandomWinner?.ticket?.id
const getControlledToken = (controlledTokens, address) => controlledTokens?.find(ct => ct.id === address)