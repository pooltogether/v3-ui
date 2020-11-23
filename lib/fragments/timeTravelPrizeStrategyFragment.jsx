import gql from 'graphql-tag'

import { timeTravelExternalErc20AwardFragment } from 'lib/fragments/timeTravelExternalErc20AwardFragment'
import { timeTravelExternalErc721AwardFragment } from 'lib/fragments/timeTravelExternalErc721AwardFragment'
import { timeTravelSingleRandomWinnerFragment } from 'lib/fragments/timeTravelSingleRandomWinnerFragment'

// this looks the same as timeTravelPrizeStrategyFragment but due to the way Apollo caches and the way
// graphql works, this is unique from timeTravelPrizeStrategyFragment
export const timeTravelPrizeStrategyFragment = gql`
  fragment timeTravelPrizeStrategyFragment on PrizeStrategy {
    id

    externalErc20Awards {
      ...timeTravelExternalErc20AwardFragment
    }
    
    externalErc721Awards {
      ...timeTravelExternalErc721AwardFragment
    }

    singleRandomWinner {
      ...timeTravelSingleRandomWinnerFragment
    }
  }
  ${timeTravelExternalErc20AwardFragment}
  ${timeTravelExternalErc721AwardFragment}
  ${timeTravelSingleRandomWinnerFragment}
`
