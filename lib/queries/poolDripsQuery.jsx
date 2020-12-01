import gql from 'graphql-tag'

import { balanceDripFragment } from 'lib/fragments/balanceDripFragment'
import { volumeDripFragment } from 'lib/fragments/volumeDripFragment'

export const poolDripsQuery = (number) => {
  const blockFilter = number > 0 ? `, block: { number: ${number} }` : ''

  return gql`
    query poolDripsQuery($prizeStrategyAddress: String!) {
      balanceDrips(where: { sourceAddress: $prizeStrategyAddress } ${blockFilter}) {
        ...balanceDripFragment
      }
      volumeDrips(where: { sourceAddress: $prizeStrategyAddress } ${blockFilter}) {
        ...volumeDripFragment
      }
    }
    ${balanceDripFragment}
    ${volumeDripFragment}
  `
}