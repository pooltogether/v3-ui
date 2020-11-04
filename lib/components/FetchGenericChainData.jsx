import { useContext, useEffect, useState } from 'react'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { useEthereumErc20Query } from 'lib/hooks/useEthereumErc20Query'
import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'
import { useEthereumGenericQuery } from 'lib/hooks/useEthereumGenericQuery'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchGenericChainData } from 'lib/utils/fetchGenericChainData'
// import { fetchExternalErc721Awards } from 'lib/utils/fetchExternalErc721Awards'

const debug = require('debug')('pool-app:FetchGenericChainData')

export function FetchGenericChainData(props) {
  const {
    chainId,
    children,
    coingeckoData,
    dynamicExternalAwardsData,
    provider,
    poolData,
  } = props
  
  const { disconnectWallet } = useContext(WalletContext)

  const { paused } = useContext(GeneralContext)

  // const [genericChainData, setGenericChainData] = useState({})

  const [retryAttempts, setRetryAttempts] = useState(0)
  const [alreadyExecuted, setAlreadyExecuted] = useState(false)
  const [storedChainId, setStoredChainId] = useState(null)
  
  // const [external20ChainData, setExternal20ChainData] = useState({})
  // const [fetching20s, setFetching20s] = useState(null)
  
  // const [external721ChainData, setExternal721ChainData] = useState({})
  // const [fetching721s, setFetching721s] = useState(null)

  const {
    status: genericChainStatus,
    data: genericChainData,
    error: genericChainError,
    isFetching: genericIsFetching
  } = useEthereumGenericQuery({
    provider,
    poolData: poolData.daiPool
  })

  if (genericChainError) {
    console.warn(genericChainError)
  }





  const graphExternalErc20Awards = dynamicExternalAwardsData?.daiPool?.externalErc20Awards
  const poolAddress = poolData.daiPool.poolAddress

  const {
    status: external20ChainStatus,
    data: external20ChainData,
    error: external20ChainError,
    isFetching: external20IsFetching
  } = useEthereumErc20Query({
    provider,
    graphErc20Awards: graphExternalErc20Awards,
    coingeckoData,
    poolAddress,
  })

  if (external20ChainError) {
    console.warn(external20ChainError)
  }




  const graphExternalErc721Awards = dynamicExternalAwardsData?.daiPool?.externalErc721Awards

  const {
    status: external721ChainStatus,
    data: external721ChainData,
    error: external721ChainError,
    isFetching: external721IsFetching
  } = useEthereumErc721Query({
    provider,
    graphErc721Awards: graphExternalErc721Awards,
    poolAddress,
  })

  if (external721ChainError) {
    console.warn(external721ChainError)
  }


  // useEffect(() => {
  //   const owner = poolData?.daiPool?.owner
  //   if (!owner) {
  //     setRetryAttempts(retryAttempts + 1)
  //   }
  // }, [poolData])

  // // Forget wallet and releoad -  this typically happens when the Graph URI is out of sync with Onboard JS's chainId
  // useEffect(() => {
  //   // console.log({ retryAttempts})
  //   if (retryAttempts > 12) {
  //     disconnectWallet()
  //     window.location.reload()
  //   }
  // }, [retryAttempts])
  

  // const _fetchDataFromInfura = async () => {
  //   const chainData = {
  //     dai: {},
  //   }

  //   chainData.dai = await fetchGenericChainData(
  //     provider,
  //     poolData.daiPool
  //   )
    
  //   return chainData
  // }

  // const _resetGenericChainData = () => {
  //   if (chainId !== storedChainId) {
  //     setAlreadyExecuted(false)
  //     setStoredChainId(chainId)
  //     setRetryAttempts(0)
  //   }
  // }

  // const _getChainDataAsync = async () => {
  //   const genericData = await _fetchDataFromInfura()
  //   setGenericChainData(genericData)
  // }

  // const _conditionallyGetChainData = async () => {
  //   const genericData = await _fetchDataFromInfura()

  //   // TODO: Looks like this DOESN'T support multiple pools as Dai is hard-coded here ...
  //   //
  //   if (isEmpty(genericData.dai)) {
  //     // this happens when switching networks:
  //     setAlreadyExecuted(false)
  //   } else {
  //     setGenericChainData(genericData)
  //   }
  // }

  // useInterval(() => {
  //   debug('fetching new chain data after MAINNET_POLLING_INTERVAL expired', MAINNET_POLLING_INTERVAL)
  //   _getChainDataAsync()
  // }, paused ? null : MAINNET_POLLING_INTERVAL)

  // useEffect(() => {
  //   if (!isEmpty(coingeckoData) && !genericChainData.dai) {
  //     debug(coingeckoData)
  //     debug('fetching new chain data since we now have coingecko price data')
  //     _getChainDataAsync()
  //   }
  // }, [coingeckoData])



  // // This only runs once when the component is mounted or when we reset the
  // // `alreadyExecuted` state var if the user changes network, etc
  // useEffect(() => {
  //   const ready = !isEmpty(provider) &&
  //     !isEmpty(poolData.daiPool) &&
  //     !isEmpty(dynamicExternalAwardsData?.daiPool)

  //   if (!alreadyExecuted && ready) {
  //     setAlreadyExecuted(true)
  //     _conditionallyGetChainData()
  //   }
  // }, [provider, chainId, poolData])

  // useEffect(() => {
  //   _resetGenericChainData()
  // }, [chainId])

  return children({ 
    genericChainData,
  })
}
