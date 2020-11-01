import gql from 'graphql-tag'

import {
  playerFragment,
} from 'lib/fragments/playerFragment'

export const timeTravelPlayerQuery = (number) => {
  let blockFilter = ''

  if (number) {
    blockFilter = `, block: { number: ${number} }`
  } 

  return gql`
    query timeTravelPlayerQuery($playerAddress: String!) {
      player: players(where: { address: $playerAddress } ${blockFilter}) {
        ...playerFragment
      },
    }
    ${playerFragment}
  `
}
