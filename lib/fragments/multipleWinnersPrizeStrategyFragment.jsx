import gql from 'graphql-tag'

import { controlledTokenFragment } from 'lib/fragments/controlledTokenFragment'
import { externalErc20AwardFragment } from 'lib/fragments/externalErc20AwardFragment'
import { externalErc721AwardFragment } from 'lib/fragments/externalErc721AwardFragment'

export const multipleWinnersPrizeStrategyFragment = gql`
  fragment multipleWinnersPrizeStrategyFragment on MultipleWinnersPrizeStrategy {
    id

    owner
    numberOfWinners
    prizePeriodSeconds

    ticket {
      ...controlledTokenFragment
    }
    sponsorship {
      ...controlledTokenFragment
    }
    externalErc20Awards {
      ...externalErc20AwardFragment
    }
    externalErc721Awards {
      ...externalErc721AwardFragment
    }
  }
  ${controlledTokenFragment}
  ${externalErc20AwardFragment}
  ${externalErc721AwardFragment}
`
