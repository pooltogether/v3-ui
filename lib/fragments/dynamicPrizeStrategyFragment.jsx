import gql from 'graphql-tag'

export const dynamicPrizeStrategyFragment = gql`
  fragment dynamicPrizeStrategyFragment on PrizeStrategy {
    id

    currentPrizeId
    currentState
  
    prizePeriodSeconds
    prizePeriodStartedAt

    # exitFeeMantissa
    # creditRateMantissa
  }
`
