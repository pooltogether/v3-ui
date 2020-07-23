import gql from 'graphql-tag'

import { playerFragment } from 'lib/fragments/playerFragment'

export const dynamicPrizePoolFragment = gql`
  fragment dynamicPrizePoolFragment on PrizePool {
    id

    playerCount
    totalSupply

    # players {
    #   ...playerFragment
    # }
  }
  # ${playerFragment}
`
