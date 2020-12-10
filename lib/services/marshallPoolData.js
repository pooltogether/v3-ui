import { PRIZE_STRATEGY_TYPES } from 'lib/constants'

// const getControlledToken = (controlledTokens, address) => controlledTokens?.find(ct => ct.id === address)

export const marshallPoolData = (daiGraphData) => {
  const prizeStrategy = daiGraphData?.prizeStrategy
  const actualStrategy = prizeStrategy?.singleRandomWinner ?
    prizeStrategy?.singleRandomWinner :
    prizeStrategy?.multipleWinners

  const prizeStrategyType = prizeStrategy?.singleRandomWinner ?
    PRIZE_STRATEGY_TYPES['singleRandomWinner'] :
    PRIZE_STRATEGY_TYPES['multipleWinners']

  const ticketToken = actualStrategy?.ticket
  const sponsorshipToken = actualStrategy?.sponsorship
  // console.log(ticketTokenAddress)
  // const ticketToken = getControlledToken(daiGraphData?.controlledTokens, ticketTokenAddress)
  // const sponsorshipToken = getControlledToken(daiGraphData?.controlledTokens, sponsorshipTokenAddress)

  const numberOfWinners = actualStrategy?.numberOfWinners

  // const ticket = actualStrategy?.ticket
  // const sponsorship = actualStrategy?.sponsorship
  // console.log({ ticket })

  const prizePeriodSeconds = actualStrategy?.prizePeriodSeconds

  const externalErc20Awards = actualStrategy?.externalErc20Awards
  const externalErc721Awards = actualStrategy?.externalErc721Awards

  const playerCount = ticketToken?.numberOfHolders
  const ticketSupply = ticketToken?.totalSupply

  const totalSponsorship = sponsorshipToken?.totalSupply

  return {
    poolAddress: daiGraphData?.id,
    externalErc20Awards,
    externalErc721Awards,
    numberOfWinners,
    playerCount,
    prizeStrategyType,
    prizePeriodSeconds,
    sponsorshipToken,
    ticketSupply,
    ticketToken,
    totalSponsorship
  }
}
