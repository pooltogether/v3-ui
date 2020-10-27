import gql from 'graphql-tag'

export const coingeckoQuery = gql`
  query coingeckoQuery {
    coingeckoData @client
  }
`

export const getCoingeckoQuery = gql`
  query readCoingeckoData {
    getCoingeckoData @client
  }
`
