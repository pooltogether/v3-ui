import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { getUsersSponsorshipBalance } from 'lib/services/getUsersSponsorshipBalance'
import { getUsersTicketBalance } from 'lib/services/getUsersTicketBalance'
import { testAddress } from 'lib/utils/testAddress'
import { useAccountQuery } from 'lib/hooks/useAccountQuery'

export const PlayerDataContext = React.createContext()
const debug = require('debug')('pool-app:PoolDataContext')

export function PlayerDataContextProvider(props) {
  const { chainId, pauseQueries, usersAddress } = useContext(AuthControllerContext)
  const { pool } = useContext(PoolDataContext)

  const addressError = testAddress(usersAddress)

  const blockNumber = -1
  const {
    refetch: refetchPlayerData,
    data: playerData,
    error,
    isFetching
  } = useAccountQuery(pauseQueries, chainId, usersAddress, blockNumber, addressError)
  console.log("PlayerDataContext", usersAddress, playerData, pool)

  if (error) {
    console.error(error)
  }

  const {
    usersTicketBalance,
    usersTicketBalanceBN
  } = getUsersTicketBalance(pool, playerData)

  const {
    usersSponsorshipBalance,
    usersSponsorshipBalanceBN
  } = getUsersSponsorshipBalance(pool, playerData)

  return <>
    <PlayerDataContext.Provider
      value={{
        refetchPlayerData,
        usersSponsorshipBalance,
        usersSponsorshipBalanceBN,
        usersTicketBalance,
        usersTicketBalanceBN,
      }}
    >
      {props.children}
    </PlayerDataContext.Provider>
  </>
}
