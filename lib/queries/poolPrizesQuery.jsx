import gql from 'graphql-tag'

import { prizeFragment } from 'lib/fragments/prizeFragment'

export const poolPrizesQuery = gql`
  query poolPrizesQuery($prizeStrategyAddress: String!) {
    prizeStrategy(id: $prizeStrategyAddress) {
      id
      prizes {
        ...prizeFragment
      }
    }
  }
  ${prizeFragment}
`
