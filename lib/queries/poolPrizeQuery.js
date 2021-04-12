import gql from 'graphql-tag'

import { prizeFragment } from 'lib/fragments/prizeFragment'

export const poolPrizeQuery = (number = -1) => {
  const blockFilter = number > 0 ? `, block: { number: ${number} }` : ''

  return gql`
    query prizeQuery($prizeId: String!) {
      prize(id: $prizeId ${blockFilter}) {
        ...prizeFragment
      }
    }
    ${prizeFragment}
  `
}
