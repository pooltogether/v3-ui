import gql from 'graphql-tag'

// import { prizeFragment } from 'lib/fragments/prizeFragment'

export const dynamicPrizeStrategyFragment = gql`
  fragment dynamicPrizeStrategyFragment on PrizeStrategy {
    id

    currentPrizeId
    currentState
  
    prizePeriodSeconds
    prizePeriodStartedAt

    # exitFeeMantissa
    # creditRateMantissa

    # prizes {
    #   ...prizeFragment
    # }
  }
  # ${prizeFragment}
`
