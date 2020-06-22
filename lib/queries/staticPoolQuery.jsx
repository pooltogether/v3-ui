import gql from 'graphql-tag'

export const staticPoolQuery = gql`
  query poolQuery($poolAddress: String!) {
    prizePools(where: { id: $poolAddress }) {
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
