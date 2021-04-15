import gql from 'graphql-tag'

import { prizeFragment } from 'lib/fragments/prizeFragment'

export const poolPrizesQuery = (number = -1) => {
  const blockFilter = number > 0 ? `, block: { number: ${number} }` : ''

  return gql`
    query poolPrizesQuery($poolAddress: String!, $skip: Int, $first: Int) {
      prizePool(id: $poolAddress ${blockFilter}) {
        id
        prizes(skip: $skip, first: $first, orderBy: awardedTimestamp, orderDirection: desc) {
          ...prizeFragment
        }
      }
    }
    ${prizeFragment}
  `
}
