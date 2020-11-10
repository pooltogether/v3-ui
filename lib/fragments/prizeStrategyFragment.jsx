import gql from 'graphql-tag'

import { externalErc20AwardFragment } from 'lib/fragments/externalErc20AwardFragment'
import { externalErc721AwardFragment } from 'lib/fragments/externalErc721AwardFragment'
import { singleRandomWinnerFragment } from 'lib/fragments/singleRandomWinnerFragment'

export const prizeStrategyFragment = gql`
  fragment prizeStrategyFragment on PrizeStrategy {
    id

    externalErc20Awards {
      ...externalErc20AwardFragment
    }
    
    externalErc721Awards {
      ...externalErc721AwardFragment
    }

    singleRandomWinner {
      ...singleRandomWinnerFragment
    }
  }
  ${externalErc20AwardFragment}
  ${externalErc721AwardFragment}
  ${singleRandomWinnerFragment}
`
