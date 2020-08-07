import gql from 'graphql-tag'

export const dynamicPrizeStrategyFragment = gql`
  fragment dynamicPrizeStrategyFragment on PrizeStrategy {
    id

    prizesCount

    currentPrizeId
    currentState
  
    prizePeriodSeconds

    # exitFeeMantissa
    # creditRateMantissa
  }
`
