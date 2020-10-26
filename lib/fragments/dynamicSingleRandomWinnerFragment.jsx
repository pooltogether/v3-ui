import gql from 'graphql-tag'

export const dynamicSingleRandomWinnerFragment = gql`
  fragment dynamicSingleRandomWinnerFragment on SingleRandomWinner {
    id

    owner
    rng
    
    ticket {
      id
      totalSupply
    }
    sponsorship {
      id
      totalSupply
    }

    prizePeriodSeconds
    prizePeriodStartedAt
    prizePeriodEndAt
  }
`
