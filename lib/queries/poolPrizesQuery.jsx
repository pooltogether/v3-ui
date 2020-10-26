import gql from 'graphql-tag'

import { prizeFragment } from 'lib/fragments/prizeFragment'

export const poolPrizesQuery = gql`
  query poolPrizesQuery($prizePoolAddress: String!, $first: Int) {
    prizePools(where: { id: $prizePoolAddress }) {
      id
      prizes(first: $first, orderBy: awardedTimestamp, orderDirection: desc) {
        ...prizeFragment
      }
    }
  }
  ${prizeFragment}
`
