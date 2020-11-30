// import React, { useContext } from 'react'
// import { ethers } from 'ethers'
// import { useRouter } from 'next/router'

// import {
//   SUPPORTED_CHAIN_IDS
// } from 'lib/constants'
// import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
// import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
// import { usePlayerQuery } from 'lib/hooks/usePlayerQuery'

// export const PlayerDataContext = React.createContext()

// export function PlayerDataContextProvider(props) {
//   const { chainId } = useContext(AuthControllerContext)
//   // const { paused } = useContext(GeneralContext)

//   const router = useRouter()
//   const playerAddress = router.query?.playerAddress?.toLowerCase()

//   if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
//     console.log('Network not supported')
//   }

//   let playerAddressError
//   if (playerAddress) {
//     try {
//       ethers.utils.getAddress(playerAddress)
//     } catch (e) {
//       console.error(e)

//       if (e.message.match('invalid address')) {
//         playerAddressError = true
//       }
//     }
//   }

//   let playerData
//   let playerDripTokenData
//   let playerBalanceDripData
//   let playerVolumeDripData

//   const { status, data, error, isFetching } = usePlayerQuery(chainId, playerAddress, blockNumber, playerAddressError)

//   playerData = data?.player
//   playerDripTokenData = data?.playerDripToken
//   playerBalanceDripData = data?.playerBalanceDrip
//   playerVolumeDripData = data?.playerVolumeDrip

//   return <PlayerDataContext.Provider
//     value={{
//       // loading,
//       playerData,
//       playerDripTokenData,
//       playerBalanceDripData,
//       playerVolumeDripData,
//     }}
//   >
//     {props.children}
//   </PlayerDataContext.Provider>

// }