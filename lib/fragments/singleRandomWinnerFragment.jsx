import gql from 'graphql-tag'

export const singleRandomWinnerFragment = gql`
  fragment singleRandomWinnerFragment on SingleRandomWinner {
    id

    ticket {
      id
      totalSupply
    }
    sponsorship {
      id
      totalSupply
    }

    prizePeriodSeconds
  }
`
