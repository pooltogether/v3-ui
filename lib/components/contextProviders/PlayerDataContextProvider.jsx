import React, { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { usePlayerQuery } from 'lib/hooks/usePlayerQuery'
import { useSponsorQuery } from 'lib/hooks/useSponsorQuery'
import { getUsersSponsorshipBalance } from 'lib/services/getUsersSponsorshipBalance'
import { getUsersTicketBalance } from 'lib/services/getUsersTicketBalance'
import { testAddress } from 'lib/utils/testAddress'
import { ethers } from 'ethers'

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
  } = usePlayerQuery(pauseQueries, chainId, usersAddress, blockNumber, addressError)

  if (error) {
    console.error(error)
  }



  // const {
  //   refetch: refetchSponsorData,
  //   data: sponsorData,
  //   error: sponsorError,
  //   isFetching: sponsorIsFetching
  // } = useSponsorQuery(pauseQueries, chainId, usersAddress, blockNumber, addressError)

  // if (sponsorError) {
  //   console.error(sponsorError)
  // }


  console.log("Get users ticket balances", playerData)

  const {
    usersTicketBalance,
    usersTicketBalanceBN
  } = getUsersTicketBalance(pool, playerData)

  let usersSponsorshipBalance = 0
  let usersSponsorshipBalanceBN = new ethers.utils.BigNumber(0)

  // const {
  //   usersSponsorshipBalance,
  //   usersSponsorshipBalanceBN
  // } = getUsersSponsorshipBalance(pool, sponsorData)

  return <>
    <PlayerDataContext.Provider
      value={{
        refetchPlayerData,
        refetchSponsorData: () => {console.log("refetch")},
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
