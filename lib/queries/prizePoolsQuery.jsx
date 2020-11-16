import gql from 'graphql-tag'

import { prizePoolFragment } from 'lib/fragments/prizePoolFragment'

export const prizePoolsQuery = gql`
  query prizePoolsQuery($poolAddresses: [String!]!) {
    prizePools(where: { id_in: $poolAddresses }) {
      ...prizePoolFragment
    }
  }
  ${prizePoolFragment}
`
