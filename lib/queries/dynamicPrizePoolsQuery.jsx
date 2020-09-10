import gql from 'graphql-tag'

import { dynamicPrizePoolFragment } from 'lib/fragments/dynamicPrizePoolFragment'

export const dynamicPrizePoolsQuery = gql`
  query dynamicPrizePoolsQuery($creator: String!) {
    prizePools(where: { creator: $creator }) {
      ...dynamicPrizePoolFragment
    }
  }
  ${dynamicPrizePoolFragment}
`
