import gql from 'graphql-tag'

import { singleRandomWinnerFragment } from 'lib/fragments/singleRandomWinnerFragment'

export const prizeStrategyFragment = gql`
  fragment prizeStrategyFragment on PrizeStrategy {
    id

    singleRandomWinner {
      ...singleRandomWinnerFragment
    }
  }
  ${singleRandomWinnerFragment}
`
