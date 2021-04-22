import React from 'react'

import { usePlayerQuery } from 'lib/hooks/usePlayerQuery'

export const PlayerDataContext = React.createContext(null)

const debug = require('debug')('pool-app:PoolDataContext')

// This is deprecated but needs to be around for the old rewards system so people
// can still claim from the drips. It only needs the 3_1_0 subgraph
export function usePlayerDrips(address, blockNumber = -1) {
  let playerDrips

  const {
    data: playerQueryData,
    error: playerQueryError,
    isFetching: playerQueryFetching
  } = usePlayerQuery(address)
  if (playerQueryError) {
    console.error(playerQueryError)
  }

  if (playerQueryData) {
    playerDrips = {
      dripTokens: playerQueryData.playerDripToken,
      balanceDrips: playerQueryData.playerBalanceDrip,
      volumeDrips: playerQueryData.playerVolumeDrip
    }
  }

  return {
    playerDrips
  }
}
