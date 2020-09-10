import gql from 'graphql-tag'

export const dynamicPrizeStrategyFragment = gql`
  fragment dynamicPrizeStrategyFragment on PrizeStrategy {
    id

    prizePool {
      id
    }

    creator
    ticket
    sponsorship
    rng

    prizesCount

    currentPrizeId
    currentState
  
    prizePeriodSeconds

    exitFeeMantissa
    creditRateMantissa
  }
`
