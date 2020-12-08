import gql from 'graphql-tag'

import { prizeFragment } from 'lib/fragments/prizeFragment'

export const poolPrizesQuery = (number) => {
  const blockFilter = number > 0 ? `, block: { number: ${number} }` : ''
    
  return gql`
    query poolPrizesQuery($poolAddress: String!, $first: Int) {
      prizePool(id: $poolAddress ${blockFilter}) {
        id
        prizes(first: $first, orderBy: awardedTimestamp, orderDirection: desc) {
          ...prizeFragment
        }
      }
    }
    ${prizeFragment}
  `
}
