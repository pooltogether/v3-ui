import gql from 'graphql-tag'

import { playerFragment } from 'lib/fragments/playerFragment'

export const prizePlayersQuery = (number) => {
  let blockFilter = ''

  if (number) {
    blockFilter = `, block: { number: ${number} }`
    // blockFilter = `, block: { number: ${number - 1} }`
  }

  return gql`
    # query prizePlayersQuery($prizePoolAddress: ID!, $prizeId: String!, $first: Int!, $skip: Int!) {
    query prizePlayersQuery($prizePoolAddress: ID!, $first: Int!, $skip: Int!) {
      players(first: $first, skip: $skip, orderBy: balance, orderDirection: desc, where: { prizePool: $prizePoolAddress }${blockFilter}) {
        ...playerFragment
      }
    }
    ${playerFragment}
  `
}
