import gql from 'graphql-tag'

import { externalErc20AwardFragment } from 'lib/fragments/externalErc20AwardFragment'
import { externalErc721AwardFragment } from 'lib/fragments/externalErc721AwardFragment'

export const singleRandomWinnerFragment = gql`
  fragment singleRandomWinnerFragment on SingleRandomWinner {
    id

    ticket {
      id
      totalSupply
      decimals
      numberOfHolders
    }
    sponsorship {
      id
      totalSupply
      decimals
      numberOfHolders
    }

    prizePeriodSeconds

    # new
    externalErc20Awards {
      ...externalErc20AwardFragment
    }
    
    externalErc721Awards {
      ...externalErc721AwardFragment
    }
  }
  ${externalErc20AwardFragment}
  ${externalErc721AwardFragment}
`
