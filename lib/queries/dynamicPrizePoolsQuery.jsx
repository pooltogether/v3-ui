import gql from 'graphql-tag'

import { dynamicPrizePoolFragment } from 'lib/fragments/dynamicPrizePoolFragment'

// There is no "query multiple ids using an array" in TheGraph's API,
// so query all prizePools and filter using code
// This could be a huge performance hit if there are tons of prizePools

export const dynamicPrizePoolsQuery = gql`
  query dynamicPrizePoolsQuery {
    prizePools {
      ...dynamicPrizePoolFragment
    }
  }
  ${dynamicPrizePoolFragment}
`
