import gql from 'graphql-tag'

export const staticPrizePoolFragment = gql`
  fragment staticPrizePoolFragment on PrizePool {
    id

    underlyingCollateralToken
    underlyingCollateralDecimals
    underlyingCollateralName
    underlyingCollateralSymbol
    
    yieldToken
    yieldDecimals
    yieldName
    yieldSymbol

    creator
    prizeStrategy

    ticket
    sponsorship
    rng

    prizePeriodSeconds

    feeScaleMantissa
    rngRequestId
  }
`
