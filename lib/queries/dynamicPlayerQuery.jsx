import gql from 'graphql-tag'

import {
  playerFragment,
  playerDripTokenFragment,
  playerBalanceDripFragment,
  playerVolumeDripFragment,
} from 'lib/fragments/playerFragment'

export const dynamicPlayerQuery = gql`
  query dynamicPlayerQuery($playerAddress: String!) {
    player: players(where: { address: $playerAddress }) {
      ...playerFragment
    },
    # playerDripToken: dripTokenPlayers(where: { address: $playerAddress }) {
    #   ...playerDripTokenFragment
    # },
    # playerBalanceDrip: balanceDripPlayers(where: { address: $playerAddress }) {
    #   ...playerBalanceDripFragment
    # },
    # playerVolumeDrip: volumeDripPlayers(where: { address: $playerAddress }) {
    #   ...playerVolumeDripFragment
    # },
  }
  ${playerFragment}
  # ${playerDripTokenFragment}
  # ${playerBalanceDripFragment}
  # ${playerVolumeDripFragment}
`
