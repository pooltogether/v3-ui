import gql from 'graphql-tag'

export const dynamicPrizePoolFragment = gql`
  fragment dynamicPrizePoolFragment on PrizePool {
    id

    totalSupply
    # totalSponsorship

    playerCount
    cumulativePrizeNet

    underlyingCollateralToken
    underlyingCollateralDecimals
    underlyingCollateralName
    underlyingCollateralSymbol
  }
`
