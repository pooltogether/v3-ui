import gql from 'graphql-tag'

import { balanceDripFragment } from 'lib/fragments/balanceDripFragment'
import { volumeDripFragment } from 'lib/fragments/volumeDripFragment'

export const prizePoolDripsQuery = gql`
  query prizePoolDripsQuery($prizeStrategyAddress: String!) {
    balanceDrips(where: { sourceAddress: $prizeStrategyAddress }) {
      ...balanceDripFragment
    }
    volumeDrips(where: { sourceAddress: $prizeStrategyAddress }) {
      ...volumeDripFragment
    }
  }
  ${balanceDripFragment}
  ${volumeDripFragment}
`
