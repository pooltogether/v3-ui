import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { SUPPORTED_CHAIN_IDS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
// import { FetchGenericChainData } from 'lib/components/FetchGenericChainData'
// import { FetchUsersChainData } from 'lib/components/FetchUsersChainData'
import { GraphPlayerQueries } from 'lib/components/queryComponents/GraphPlayerQueries'
import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'
import { chainIdToName } from 'lib/utils/chainIdToName'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { isEmptyObject } from 'lib/utils/isEmptyObject'
import { poolToast } from 'lib/utils/poolToast'
// import { readProvider } from 'lib/utils/readProvider'

export const PlayerDataContext = React.createContext()

export const PlayerDataContextProvider = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { chainId, usersAddress } = authControllerContext

  // const [defaultReadProvider, setDefaultReadProvider] = useState({})

  const router = useRouter()
  const playerAddress = router.query.playerAddress && router.query.playerAddress.toLowerCase()

  // const networkName = chainId ?
  //   chainIdToName(chainId) :
  //   process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME

  // useEffect(() => {
  //   const getReadProvider = async () => {
  //     const defaultReadProvider = await readProvider(networkName)
  //     setDefaultReadProvider(defaultReadProvider)
  //   }
  //   getReadProvider()
  // }, [networkName])
  

  let error
  try {
    if (playerAddress) {
      ethers.utils.getAddress(playerAddress)
    }
  } catch (e) {
    error = 'Incorrectly formatted Ethereum address!'
  }


  let poolAddresses
  try {
    poolAddresses = getContractAddresses(chainId)
  } catch (e) {
    poolToast.error(e)
    console.error(e)
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
            

              // return <FetchGenericChainData
              //   {...props}
              //   chainId={chainId}
              //   provider={defaultReadProvider}
              //   poolAddresses={poolAddresses}
              // >
              //   {({ genericChainData }) => {
              //     let pools = []

              //     if (!graphDataLoading) {
              //       pools = [
              //         {
              //           ...genericChainData.daiPrizeStrategy,
              //           ...dynamicPoolData.daiPool,
              //           ...dynamicPrizeStrategiesData.daiPrizeStrategy,
              //           ...staticPoolData.daiPool,
              //           ...staticPrizeStrategiesData.daiPrizeStrategy,
              //           name: 'Daily Dai Pool',
              //           symbol: 'PT-cDAI',
              //         },
              //         {
              //           ...genericChainData.usdcPrizeStrategy,
              //           ...dynamicPoolData.usdcPool,
              //           ...dynamicPrizeStrategiesData.usdcPrizeStrategy,
              //           ...staticPoolData.usdcPool,
              //           ...staticPrizeStrategiesData.usdcPrizeStrategy,
              //           name: 'Daily USDC Pool',
              //           symbol: 'PT-cUSDC',
              //         },
              //         {
              //           ...genericChainData.usdtPrizeStrategy,
              //           ...dynamicPoolData.usdtPool,
              //           ...dynamicPrizeStrategiesData.usdtPrizeStrategy,
              //           ...staticPoolData.usdtPool,
              //           ...staticPrizeStrategiesData.usdtPrizeStrategy,
              //           name: 'Weekly Tether Pool',
              //           symbol: 'PT-cUSDT',
              //         },
              //       ]
              //     }

              //     let usersTicketBalance = 0
              //     let usersTicketBalanceBN = ethers.utils.bigNumberify(0)

              //     if (pool && dynamicPlayerData) {
              //       const poolAddress = pool && pool.poolAddress
              //       const player = dynamicPlayerData.find(data => data.prizePool.id === poolAddress)

              //       if (player) {
              //         usersTicketBalance = Number(ethers.utils.formatUnits(
              //           player.balance,
              //           pool.underlyingCollateralDecimals
              //         ))
              //         usersTicketBalanceBN = ethers.utils.bigNumberify(player.balance)
              //       }
              //     }



              //     return <FetchUsersChainData
              //       {...props}
              //       provider={defaultReadProvider}
              //       pool={pool}
              //       usersAddress={usersAddress}
              //     >
              //       {({ usersChainData }) => {
              //         return <PlayerDataContext.Provider
              //           value={{
              //             chainId,
              //             loading: graphDataLoading,
              //             pool,
              //             pools,
              //             poolAddresses,
              //             dynamicPoolData,
              //             dynamicPlayerData,
              //             staticPoolData,
              //             genericChainData,
              //             usersChainData,
              //             usersTicketBalance,
              //             usersTicketBalanceBN,
              //           }}
              //         >
              //           {props.children}
              //         </PlayerDataContext.Provider>


              //       }}
              //     </FetchUsersChainData>
              //   }}
              // </FetchGenericChainData>
            }}
          </GraphPlayerQueries>
        }

        
      }}
    </V3ApolloWrapper>
  </>
}
