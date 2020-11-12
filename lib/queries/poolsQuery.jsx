import gql from 'graphql-tag'

import { prizePoolFragment } from 'lib/fragments/prizePoolFragment'

export const poolsQuery = (number) => {
  let blockFilter = ''

  if (number) {
    blockFilter = `, block: { number: ${number} }`
  } 

  return gql`
    query poolsQuery($ids: [String!]!) {
      prizePools(where: { id_in: $ids }${blockFilter}) {
        ...prizePoolFragment
      }
    }
    ${prizePoolFragment}
  `

}
