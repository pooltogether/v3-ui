// import { useContext, useEffect, useState } from 'react'

// import {
//   MAINNET_POLLING_INTERVAL
// } from 'lib/constants'
// import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
// import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
// import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
// import { useInterval } from 'lib/hooks/useInterval'
// import { fetchExtendedChainData } from 'lib/utils/fetchExtendedChainData'
// import { isEmptyObject } from 'lib/utils/isEmptyObject'

// export const FetchExtendedChainData = (props) => {
//   const {
//     children,
//   } = props

//   const generalContext = useContext(GeneralContext)
//   const { paused } = generalContext
 
//   const poolDataContext = useContext(PoolDataContext)
//   const { pool } = poolDataContext
  
//   const authControllerContext = useContext(AuthControllerContext)
//   const { chainId, provider } = authControllerContext
  
//   const [extendedChainData, setExtendedChainData] = useState({})

//   const fetchDataFromInfura = async () => {
//     try {
//       const prizeStrategy = await fetchExtendedChainData(
//         provider,
//         pool?.prizeStrategyAddress
//       )

//       return {
//         prizeStrategy,
//       }
//     } catch (e) {
//       console.warn(e)
//       return {}
//     }
//   }

//   const updateOrDelete = async () => {
//     const genericData = await fetchDataFromInfura()
//     setExtendedChainData(genericData)
//   }

//   useInterval(() => {
//     if (provider && !isEmptyObject(provider)) {
//       updateOrDelete()
//     }
//   }, paused ? null : MAINNET_POLLING_INTERVAL)

//   useEffect(() => {
//     if (provider && !isEmptyObject(provider)) {
//       updateOrDelete()
//     }

//     // OPTIMIZE: Could reset the interval loop here
//     // since we just grabbed fresh data!
//   }, [provider, chainId])

//   return children({ extendedChainData })
// }
