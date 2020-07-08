import gql from 'graphql-tag'

export const staticPrizePoolFragment = gql`
  fragment staticPrizePoolFragment on PrizePool {
    id

    underlyingCollateralToken
    underlyingCollateralName
    underlyingCollateralSymbol
    
    yieldToken
    yieldTokenName
    yieldTokenSymbol

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
