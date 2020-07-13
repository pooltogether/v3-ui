import gql from 'graphql-tag'

import { playerFragment } from 'lib/fragments/playerFragment'

export const dynamicPrizePoolFragment = gql`
  fragment dynamicPrizePoolFragment on PrizePool {
    id

    currentPrizeId
    currentState
  
    prizePeriodStartedAt

    previousPrize
    previousPrizeAverageTickets

    playerCount

    totalSupply

    players {
      ...playerFragment
    }
  }
  ${playerFragment}
`
