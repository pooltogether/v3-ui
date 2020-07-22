import gql from 'graphql-tag'

import { playerFragment } from 'lib/fragments/playerFragment'

export const dynamicPlayerQuery = gql`
  query dynamicPlayerQuery($playerAddress: String!) {
    # dai: players(where: { id: "0x59a0ed7be8117369bdd1cd2c4e3c35958c5149f1-0x8f7f92e0660dd92eca1fad5f285c4dca556e433e" }) {
    #   ...playerFragment
    # }
    # usdc: players(where: { id: "0xb2ecdc06e07e1bff27d13440bc40351d769d7353-0x8f7f92e0660dd92eca1fad5f285c4dca556e433e" }) {
    #   ...playerFragment
    # }
    # usdt: players(where: { id: "0x55907a3699bd33be7dcc3e754ff4cbf54bd72145-0x8f7f92e0660dd92eca1fad5f285c4dca556e433e" }) {
    #   ...playerFragment
    # }
    player: players(where: { address: $playerAddress }) {
      ...playerFragment
      
      prizePool {
        id
      }
    }
  }
  ${playerFragment}
`
