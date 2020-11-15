import gql from 'graphql-tag'

import { prizeStrategyFragment } from 'lib/fragments/prizeStrategyFragment'

export const prizeStrategiesQuery = gql`
  query prizeStrategiesQuery($id: String!) {
    prizeStrategies(where: { id: $id }) {
      ...prizeStrategyFragment
    }
  }
  ${prizeStrategyFragment}
`
