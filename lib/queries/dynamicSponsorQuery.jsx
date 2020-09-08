import gql from 'graphql-tag'


export const dynamicSponsorQuery = gql`
  query dynamicSponsorQuery($sponsorAddress: String!) {
    sponsor: sponsors(where: { address: $sponsorAddress }) {
      id
      balance
      address
      
      prizePool {
        id
      }
    }
  }
`
