import gql from 'graphql-tag'

import { multipleWinnersPrizeStrategyFragment } from 'lib/fragments/multipleWinnersPrizeStrategyFragment'
import { singleRandomWinnerFragment } from 'lib/fragments/singleRandomWinnerFragment'

export const prizeStrategyFragment = gql`
  fragment prizeStrategyFragment on PrizeStrategy {
    id

    singleRandomWinner {
      ...singleRandomWinnerFragment
    }
    multipleWinnersPrizeStrategy {
      ...multipleWinnersPrizeStrategyFragment
    }
  }
  ${singleRandomWinnerFragment}
  ${multipleWinnersPrizeStrategyFragment}
`
