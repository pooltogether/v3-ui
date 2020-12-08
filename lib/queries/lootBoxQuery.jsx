import gql from 'graphql-tag'

import { lootBoxFragment } from 'lib/fragments/lootBoxFragment'

export const lootBoxQuery = (number) => {
  let blockFilter = ''

  if (number > 0) {
    blockFilter = `, block: { number: ${number} }`
  }

  return gql`
    query lootBoxQuery($lootBoxAddress: ID!, $first: Int!) {
      lootBoxes(
        first: $first,
        orderDirection: desc,
        where: { lootBox: $lootBoxAddress }${blockFilter}
      ) {
        ...lootBoxFragment
      }
    }
    ${lootBoxFragment}
  `
}
