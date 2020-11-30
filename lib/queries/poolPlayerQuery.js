import gql from 'graphql-tag'

import { playerFragment } from 'lib/fragments/playerFragment'

export const poolPlayerQuery = (number) => {
  const blockFilter = number > 0 ? `, block: { number: ${number} }` : ''

  return gql`
    query playerQuery($playerId: String!) {
      player(id: { $playerId } ${blockFilter}) {
        ...playerFragment
      },
    }
    ${playerFragment}
  `
}
