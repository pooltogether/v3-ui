import gql from 'graphql-tag'

import { controlledTokenFragment } from 'lib/fragments/controlledTokenFragment'

export const accountFragment = gql`
  fragment accountFragment on Account {
    id

    controlledTokenBalances {
      id
      balance
      controlledToken {
        ...controlledTokenFragment
      }
    }
  }
  ${controlledTokenFragment}
`
