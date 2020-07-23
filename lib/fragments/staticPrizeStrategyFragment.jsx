import gql from 'graphql-tag'

// import { prizeFragment } from 'lib/fragments/prizeFragment'

export const staticPrizeStrategyFragment = gql`
  fragment staticPrizeStrategyFragment on PrizeStrategy {
    id

    prizePool {
      id
    }

    ticket
    sponsorship
    rng

    # exitFeeMantissa
    # creditRateMantissa
  }
`
