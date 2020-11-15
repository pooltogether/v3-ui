import gql from 'graphql-tag'

import { prizePoolFragment } from 'lib/fragments/prizePoolFragment'

export const timeTravelPoolQuery = (number) => {
  let blockFilter = ''

  if (number) {
    blockFilter = `, block: { number: ${number} }`
  }

  return gql`
    query timeTravelPoolQuery($prizePoolAddress: ID!) {
      timeTravelPrizePool: prizePool(id: $prizePoolAddress ${blockFilter}) {
        ...prizePoolFragment
      }
    }
    ${prizePoolFragment}
  `
}
