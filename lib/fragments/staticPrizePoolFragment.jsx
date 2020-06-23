import gql from 'graphql-tag'

export const staticPrizePoolFragment = gql`
  fragment staticPrizePoolFragment on PrizePool {
    id

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
