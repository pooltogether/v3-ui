import gql from 'graphql-tag'

import { externalErc20AwardFragment } from 'lib/fragments/externalErc20AwardFragment'
import { externalErc721AwardFragment } from 'lib/fragments/externalErc721AwardFragment'

export const externalAwardsQuery = gql`
  query externalAwardsQuery {
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
