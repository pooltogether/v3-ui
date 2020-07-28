import React, { useContext } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { SUPPORTED_CHAIN_IDS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { GraphPlayerQueries } from 'lib/components/queryComponents/GraphPlayerQueries'
import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'
import { isEmptyObject } from 'lib/utils/isEmptyObject'

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

  return <>
    {error && <>
      <div className='text-red font-bold p-4 mx-auto border-2'>
        {error}
      </div>
    </>}

    <V3ApolloWrapper>
      {(client) => {
        // console.log({client})
        // check if client is ready
        if (
          !playerAddress ||
          isEmptyObject(client) ||
          !SUPPORTED_CHAIN_IDS.includes(chainId)
        ) {
          // console.log('client not ready')
          return <PlayerDataContext.Provider
            value={{
              loading: false,
              playerData: null
            }}
          >
            {props.children}
          </PlayerDataContext.Provider>
        } else {
          return <GraphPlayerQueries
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
      }}
    </V3ApolloWrapper>
  </>
}