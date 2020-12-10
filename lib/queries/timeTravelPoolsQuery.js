import gql from 'graphql-tag'

import { prizePoolFragment } from 'lib/fragments/prizePoolFragment'

export const timeTravelPoolsQuery = (number) => {
  let blockFilter = ''

  if (number > 0) {
    blockFilter = `, block: { number: ${number} }`
  } 

  return gql`
    query timeTravelPoolsQuery($ids: [String!]!) {
      timeTravelPrizePools: prizePools(where: { id_in: $ids }${blockFilter}) {
        ...prizePoolFragment
      }
    }
    ${prizePoolFragment}
  `

}
