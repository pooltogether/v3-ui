import gql from 'graphql-tag'

export const dynamicSingleRandomWinnerFragment = gql`
  fragment dynamicSingleRandomWinnerFragment on SingleRandomWinner {
    id

    owner
    ticket { id }
    sponsorship { id }
    rng

    prizePeriodSeconds
    prizePeriodStartedAt
    prizePeriodEndAt
  }
`
