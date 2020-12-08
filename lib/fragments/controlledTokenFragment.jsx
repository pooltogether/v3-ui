import gql from 'graphql-tag'
import { accountFragment } from 'lib/fragments/accountFragment'

import { controlledTokenBalanceFragment } from 'lib/fragments/controlledTokenBalanceFragment'

export const controlledTokenFragment = gql`
  fragment controlledTokenFragment on ControlledToken {
    id
    name
    symbol
    decimals
    # balances {
    #   ...controlledTokenBalanceFragment
    # }
  }
  # ${controlledTokenBalanceFragment}
`
