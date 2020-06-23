import gql from 'graphql-tag'

// There is no "query multiple ids using an array" in TheGraph's API,
// so query all prizePools and filter using code
// This could be a huge performance hit if there are tons of prizePools

export const staticPrizePoolsQuery = gql`
  query prizePoolsQuery {
    prizePools {
      id

      currentPrizeId
      currentState
    
      creator
      prizeStrategy

      ticket
      sponsorship
      rng

      prizePeriodSeconds
      prizePeriodStartedAt

      previousPrize
      previousPrizeAverageTickets

      feeScaleMantissa
      rngRequestId
    }
  }
`
