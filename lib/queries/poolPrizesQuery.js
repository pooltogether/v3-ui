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

// TODO: In single fetch, get the prize strat and merge the token ids as a work around

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
