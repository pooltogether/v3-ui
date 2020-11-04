// import React, { useContext } from 'react'
// import classnames from 'classnames'

// import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
// import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
// import { networkBgColorClassname } from 'lib/utils/networkColorClassnames'

// export function StaticNetworkNotificationBanner(props) {
//   const authControllerContext = useContext(AuthControllerContext)
//   const { supportedNetwork, chainId, usersAddress } = authControllerContext

//   // if (!usersAddress) {
//   //   return null
//   // }

//   let networkName = null
//   if (chainId && supportedNetwork) {
//     networkName = <span
//       className={classnames(
//         // networkTextColorClassname(chainId),
//         'inline-block'
//       )}
//     >
//       {chainIdToNetworkName(chainId)}
//     </span>
//   }

//   const supportedNetworkClasses = `block bg-${networkBgColorClassname(chainId)}`
//   const supportedNetworkNames = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME

//   const verb = usersAddress ? 'connected to' : 'viewing'
  
//   return <>
//     <div
//       className={classnames(
//         'text-sm sm:text-base lg:text-lg sm:px-6 py-2',
//         {
//           'block bg-red': !supportedNetwork,
//           [supportedNetworkClasses]: supportedNetwork,
//         }
//       )}
//     >
//       <div
//         className='text-center text-white'
//       >
//         {!supportedNetwork ? <>
//           Please connect to the supported network <span
//             className='font-bold'
//           >
//             {supportedNetworkNames}
//           </span>.
//         </> : <>
//           You are {verb} <span
//             className='font-bold'
//           >{networkName}</span>.
//         </>}
//       </div>
//     </div>
//   </>
// }