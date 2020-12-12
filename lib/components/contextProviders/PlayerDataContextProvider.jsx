import React, { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { useAccountQuery } from 'lib/hooks/useAccountQuery'
import { usePlayerQuery } from 'lib/hooks/usePlayerQuery'
import { getUsersSponsorshipBalance } from 'lib/services/getUsersSponsorshipBalance'
import { getUsersTicketBalance } from 'lib/services/getUsersTicketBalance'
import { testAddress } from 'lib/utils/testAddress'

export const PlayerDataContext = React.createContext()

const debug = require('debug')('pool-app:PoolDataContext')

// we'll need to remove and un-DRY all of this when you're looking at <Account /> components for
// another player
export function PlayerDataContextProvider(props) {
  const { usersAddress } = useContext(AuthControllerContext)
  const { pools, pool } = useContext(PoolDataContext)

  const addressError = testAddress(usersAddress)

  const blockNumber = -1
  const {
    refetch: refetchAccountData,
    data: accountData,
    isFetching: accountDataIsFetching,
    isFetched: accountDataIsFetched,
    error: accountDataError,
  } = useAccountQuery(usersAddress, blockNumber, addressError)

  if (accountDataError) {
    console.error(accountDataError)
  }

  const getPlayerTicketAccount = (pool) => {
    const poolAddress = pool?.id
    const ticketAddress = pool?.ticketToken?.id
    let balance = accountData?.controlledTokenBalances.find(ct => ct.controlledToken.id === ticketAddress)?.balance
    if (!balance) return

    return {
      pool,
      poolAddress,
      balance
    }
  }

  let playerTicketAccounts = []
  playerTicketAccounts = pools
    .map(getPlayerTicketAccount)
    .filter(playerTicketAccount => playerTicketAccount !== undefined)


  let dynamicPlayerDrips

  const {
    data: playerQueryData,
    error: playerQueryError,
    isFetching: playerQueryFetching
  } = usePlayerQuery(usersAddress)
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



  const {
    usersTicketBalance,
    usersTicketBalanceBN
  } = getUsersTicketBalance(pool, accountData)

  const {
    usersSponsorshipBalance,
    usersSponsorshipBalanceBN
  } = getUsersSponsorshipBalance(pool, accountData)

  return <>
    <PlayerDataContext.Provider
      value={{
        accountData,
        refetchAccountData,
        accountDataIsFetching,
        accountDataIsFetched,
        dynamicPlayerDrips,
        playerTicketAccounts,
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
