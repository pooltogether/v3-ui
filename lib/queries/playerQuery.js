import gql from 'graphql-tag'

import {
  playerDripTokenFragment,
  playerBalanceDripFragment,
  playerVolumeDripFragment,
} from 'lib/fragments/playerFragment'

export const playerQuery = (number) => {
  const blockFilter = number > 0 ? `, block: { number: ${number} }` : ''

  return gql`
    query playerQuery($playerAddress: String!) {
      playerDripToken: dripTokenPlayers(where: { address: $playerAddress }) {
        ...playerDripTokenFragment
      }
      playerBalanceDrip: balanceDripPlayers(where: { address: $playerAddress }) {
        ...playerBalanceDripFragment
      }
      playerVolumeDrip: volumeDripPlayers(where: { address: $playerAddress }) {
        ...playerVolumeDripFragment
      }
    }
    ${playerDripTokenFragment}
    ${playerBalanceDripFragment}
    ${playerVolumeDripFragment}
  `
}
