import React, { useContext } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import {
  MAINNET_POLLING_INTERVAL,
  SUPPORTED_CHAIN_IDS
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { dynamicPlayerQuery } from 'lib/queries/dynamicPlayerQuery'

export const PlayerDataContext = React.createContext()

export const PlayerDataContextProvider = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { chainId } = authControllerContext

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const router = useRouter()
  const playerAddress = router.query?.playerAddress?.toLowerCase()

  if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
    console.error('network not supported')
  }

  let playerAddressError
  if (playerAddress) {
    try {
      ethers.utils.getAddress(playerAddress)
    } catch (e) {
      console.error(e)

      if (e.message.match('invalid address')) {
        playerAddressError = 'Incorrectly formatted Ethereum address!'
        console.error(playerAddressError)
      }
    }
  }


  let playerData

  const { loading, error, data } = useQuery(dynamicPlayerQuery, {
    variables: {
      playerAddress
    },
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
    skip: !playerAddress || playerAddressError
  })

  if (error) {
    console.error(error)
  }

  playerData = data?.player

  return <PlayerDataContext.Provider
    value={{
      // loading,
      playerData
    }}
  >
    {props.children}
  </PlayerDataContext.Provider>
  
}