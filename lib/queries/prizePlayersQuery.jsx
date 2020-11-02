import gql from 'graphql-tag'

import { playerFragment } from 'lib/fragments/playerFragment'

export const prizePlayersQuery = (number) => {
  let blockFilter = ''

  if (number) {
    blockFilter = `, block: { number: ${number} }`
  }

  return gql`
    query prizePlayersQuery($prizePoolAddress: ID!, $first: Int!, $skip: Int!) {
      players(first: $first, skip: $skip, orderBy: balance, orderDirection: desc, where: { prizePool: $prizePoolAddress }${blockFilter}) {
        ...playerFragment
      }
    }
    ${playerFragment}
  `
}
