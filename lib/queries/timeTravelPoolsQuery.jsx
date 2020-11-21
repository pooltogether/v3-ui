import gql from 'graphql-tag'

import { timeTravelPrizePoolFragment } from 'lib/fragments/timeTravelPrizePoolFragment'

export const timeTravelPoolsQuery = (number) => {
  let blockFilter = ''

  if (number > 0) {
    blockFilter = `, block: { number: ${number} }`
  } 

  return gql`
    query timeTravelPoolsQuery($ids: [String!]!) {
      timeTravelPrizePools: prizePools(where: { id_in: $ids }${blockFilter}) {
        ...timeTravelPrizePoolFragment
      }
    }
    ${timeTravelPrizePoolFragment}
  `

}
