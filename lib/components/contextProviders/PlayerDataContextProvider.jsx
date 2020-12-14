import React, { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePlayerQuery } from 'lib/hooks/usePlayerQuery'

export const PlayerDataContext = React.createContext()

const debug = require('debug')('pool-app:PoolDataContext')

export function PlayerDataContextProvider(props) {
  const { usersAddress } = useContext(AuthControllerContext)

  // fill this in with a watched address or an address from router params
  const playerAddress = ''

  const address = playerAddress || usersAddress
  // const { usersAddress } = useContext(AuthControllerContext)

  let dynamicPlayerDrips

  const {
    data: playerQueryData,
    error: playerQueryError,
    isFetching: playerQueryFetching
  } = usePlayerQuery(address)
  if (playerQueryError) {
    console.error(playerQueryError)
  }

  if (playerQueryData) {
    dynamicPlayerDrips = {
      dripTokens: playerQueryData.playerDripToken,
      balanceDrips: playerQueryData.playerBalanceDrip,
      volumeDrips: playerQueryData.playerVolumeDrip,
    }
  }

  return <>
    <PlayerDataContext.Provider
      value={{
        dynamicPlayerDrips,
      }}
    >
      {props.children}
    </PlayerDataContext.Provider>
  </>
}
