import gql from 'graphql-tag'

import { dynamicPrizeStrategyFragment } from 'lib/fragments/dynamicPrizeStrategyFragment'

// There is no "query multiple ids using an array" in TheGraph's API,
// so query all prizeStrategies and filter using code
// This could be a huge performance hit if there are tons of prizeStrategies
// may be better to split each prizeStrategy we want into it's own query?

export const dynamicPrizeStrategiesQuery = gql`
  query dynamicPrizeStrategiesQuery {
    prizeStrategies {
      ...dynamicPrizeStrategyFragment
    }
  }
  ${dynamicPrizeStrategyFragment}
`
