import gql from 'graphql-tag'

export const dynamicPrizePoolFragment = gql`
  fragment dynamicPrizePoolFragment on PrizePool {
    id

    currentPrizeId
    currentState
  
    prizePeriodStartedAt

    previousPrize
    previousPrizeAverageTickets
  }
`
