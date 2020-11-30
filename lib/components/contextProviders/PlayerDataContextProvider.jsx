import React, { useContext, useEffect, useState } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { usePlayerQuery } from 'lib/hooks/usePlayerQuery'
import { getUsersSponsorshipBalance } from 'lib/services/getUsersSponsorshipBalance'
import { getUsersTicketBalance } from 'lib/services/getUsersTicketBalance'
import { testAddress } from 'lib/utils/testAddress'

export const PlayerDataContext = React.createContext()
const debug = require('debug')('pool-app:PoolDataContext')

export function PlayerDataContextProvider(props) {
  const { chainId, usersAddress } = useContext(AuthControllerContext)
  const { pool } = useContext(PoolDataContext)


  const playerAddressError = testAddress(usersAddress)

  const blockNumber = -1
  const {
    status,
    data: playerData,
    error,
    isFetching
  } = usePlayerQuery(chainId, usersAddress, blockNumber, playerAddressError)

  if (error) {
    console.error(error)
  }


  const {
    usersTicketBalance,
    usersTicketBalanceBN
  } = getUsersTicketBalance(pool, playerData)

  // const {
  //   usersSponsorshipBalance,
  //   usersSponsorshipBalanceBN
  // } = getUsersSponsorshipBalance(pool, dynamicSponsorData)

  return <>
    <PlayerDataContext.Provider
      value={{
        // usersSponsorshipBalance,
        // usersSponsorshipBalanceBN,
        usersTicketBalance,
        usersTicketBalanceBN,
      }}
    >
      {props.children}
    </PlayerDataContext.Provider>
  </>
}
