import gql from 'graphql-tag'

export const dynamicPrizeStrategyFragment = gql`
  fragment dynamicPrizeStrategyFragment on PrizeStrategy {
    id

    prizePool {
      id
    }

    ticket
    sponsorship
    rng

    prizesCount

    currentPrizeId
    currentState
  
    prizePeriodSeconds

    # exitFeeMantissa
    # creditRateMantissa
  }
`
