import gql from 'graphql-tag'

import {
  playerFragment,
} from 'lib/fragments/playerFragment'

export const dynamicPlayerQuery = gql`
  query dynamicPlayerQuery($playerAddress: String!) {
    player: players(where: { address: $playerAddress }) {
      ...playerFragment
    },
  }
  ${playerFragment}
`
