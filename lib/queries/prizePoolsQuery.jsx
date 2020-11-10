import gql from 'graphql-tag'

import { prizePoolFragment } from 'lib/fragments/prizePoolFragment'

export const prizePoolsQuery = gql`
  query prizePoolsQuery($owner: String!) {
    prizePools(where: { owner: $owner }) {
      ...prizePoolFragment
    }
  }
  ${prizePoolFragment}
`
