import React, { useContext } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { SUPPORTED_CHAIN_IDS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { GraphPlayerQueries } from 'lib/components/queryComponents/GraphPlayerQueries'

export const PlayerDataContext = React.createContext()

export const PlayerDataContextProvider = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { chainId } = authControllerContext

  const router = useRouter()
  const playerAddress = router.query.playerAddress && router.query.playerAddress.toLowerCase()

  let error
  try {
    if (playerAddress) {
      ethers.utils.getAddress(playerAddress)
    }
  } catch (e) {
    error = 'Incorrectly formatted Ethereum address!'
  }

  let content = <PlayerDataContext.Provider
    value={{
      loading: false,
      playerData: null
    }}
  >
    {props.children}
  </PlayerDataContext.Provider>

  if (
    playerAddress &&
    SUPPORTED_CHAIN_IDS.includes(chainId)
  ) {
    content = <GraphPlayerQueries
      {...props}
      playerAddress={playerAddress}
    >
      {({
        playerData,
        loading
      }) => {
        return <PlayerDataContext.Provider
          value={{
            loading,
            playerData
          }}
        >
          {props.children}
        </PlayerDataContext.Provider>
      }}
    </GraphPlayerQueries>
  }

  return <>
    {error && <>
      <div className='text-red font-bold p-4 mx-auto border-2'>
        {error}
      </div>
    </>}

    {content}
  </>
}