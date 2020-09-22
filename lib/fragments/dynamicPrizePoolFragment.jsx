import gql from 'graphql-tag'

export const dynamicPrizePoolFragment = gql`
  fragment dynamicPrizePoolFragment on PrizePool {
    id

    owner

    prizeStrategy {
      id
    }

    reserveFeeControlledToken
    yieldToken

    underlyingCollateralToken
    underlyingCollateralDecimals
    underlyingCollateralName
    underlyingCollateralSymbol

    maxExitFeeMantissa
    maxTimelockDuration
    timelockTotalSupply
    liquidityCap

    playerCount
    totalSupply
    totalSponsorship

    cumulativePrizeGross
    cumulativePrizeReserveFee
    cumulativePrizeNet

    currentPrizeId
    currentState

    prizesCount
  }
`
