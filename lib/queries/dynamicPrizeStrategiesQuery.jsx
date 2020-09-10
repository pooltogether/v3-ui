import gql from 'graphql-tag'

import { dynamicPrizeStrategyFragment } from 'lib/fragments/dynamicPrizeStrategyFragment'

export const dynamicPrizeStrategiesQuery = gql`
  query dynamicPrizeStrategiesQuery($creator: String!) {
    prizeStrategies(where: { creator: $creator }) {
      ...dynamicPrizeStrategyFragment
    }
  }
  ${dynamicPrizeStrategyFragment}
`
