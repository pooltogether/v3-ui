import gql from 'graphql-tag'

export const coingeckoQuery = gql`
  query coingeckoQuery {
    coingeckoData @client
  }
`
