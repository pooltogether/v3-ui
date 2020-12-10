import { PRIZE_STRATEGY_TYPES } from 'lib/constants'

const getControlledToken = (controlledTokens, address) => controlledTokens?.find(ct => ct.id === address)

export const marshallPoolData = (daiGraphData, historical = false) => {
  const prizeStrategy = daiGraphData?.prizeStrategy
  const actualStrategy = prizeStrategy?.singleRandomWinner ?
    prizeStrategy?.singleRandomWinner :
    prizeStrategy?.multipleWinners

  const prizeStrategyType = prizeStrategy?.singleRandomWinner ?
    PRIZE_STRATEGY_TYPES['singleRandomWinner'] :
    PRIZE_STRATEGY_TYPES['multipleWinners']

  const ticketToken = getControlledToken(daiGraphData?.controlledTokens, actualStrategy?.ticket?.id)
  const sponsorshipToken = getControlledToken(daiGraphData?.controlledTokens, actualStrategy?.sponsorship?.id)

  // const ticketToken = actualStrategy?.ticket
  // const sponsorshipToken = actualStrategy?.sponsorship

  const numberOfWinners = actualStrategy?.numberOfWinners

  const prizePeriodSeconds = actualStrategy?.prizePeriodSeconds

  const externalErc20Awards = actualStrategy?.externalErc20Awards
  const externalErc721Awards = actualStrategy?.externalErc721Awards

  // console.log(ticketToken)
  const playerCount = ticketToken?.numberOfHolders
  const ticketSupply = ticketToken?.totalSupply

  const totalSponsorship = sponsorshipToken?.totalSupply

  if (historical) {
    console.log(daiGraphData)
    console.log(actualStrategy)
    console.log(prizeStrategyType)
    console.log(ticketToken)
    console.log(sponsorshipToken)
    console.log(numberOfWinners)

  }

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
    totalSponsorship,
    ticket: ticketToken, // TODO: remove this, use ticketToken instead
    sponsorship: sponsorshipToken // TODO: remove this, use sponsorshipToken instead
  }
}
