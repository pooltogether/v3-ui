import gql from 'graphql-tag'

import { balanceDripFragment } from 'lib/fragments/balanceDripFragment'
import { volumeDripFragment } from 'lib/fragments/volumeDripFragment'

export const poolDripsQuery = (number) => {
  const blockFilter = number > 0 ? `, block: { number: ${number} }` : ''

  return gql`
    query poolDripsQuery($addresses: [String]!) {
      balanceDrips(where: { sourceAddress_in: $addresses } ${blockFilter}) {
        ...balanceDripFragment
      }
      volumeDrips(where: { sourceAddress_in: $addresses  } ${blockFilter}) {
        ...volumeDripFragment
      }
    }
    ${balanceDripFragment}
    ${volumeDripFragment}
  `
}
