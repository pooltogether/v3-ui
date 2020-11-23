import gql from 'graphql-tag'

import { playerFragment } from 'lib/fragments/playerFragment'

// playerId is "prizePoolAddress-playerAddress"
export const playerQuery = (number) => {
  let blockFilter = ''

  if (number > 0) {
    blockFilter = `, block: { number: ${number} }`
  } 

  return gql`
    query playerQuery($playerId: String!) {
      player(id: $playerId ${blockFilter}) {
        ...playerFragment
      },
    }
    ${playerFragment}
  `
}
