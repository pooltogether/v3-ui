import gql from 'graphql-tag'

import { playerFragment } from 'lib/fragments/playerFragment'

export const playerQuery = (number) => {
  const blockFilter = number > 0 ? `, block: { number: ${number} }` : ''

  return gql`
    query playerQuery($playerAddress: String!) {
      player: players(where: { address: $playerAddress } ${blockFilter}) {
        ...playerFragment
      },
    }
    ${playerFragment}
  `
}
