import { useContext, useEffect, useState } from 'react'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchGenericChainData } from 'lib/utils/fetchGenericChainData'
import { fetchExternalErc20Awards } from 'lib/utils/fetchExternalErc20Awards'
import { fetchExternalErc721Awards } from 'lib/utils/fetchExternalErc721Awards'

const debug = require('debug')('pool-app:FetchGenericChainData')

export const FetchGenericChainData = (props) => {
  const {
    chainId,
    children,
    coingeckoData,
    dynamicExternalAwardsData,
    provider,
    poolData,
  } = props
  
  const graphExternalErc20Awards = dynamicExternalAwardsData?.daiPool?.externalErc20Awards
  
  const { disconnectWallet } = useContext(WalletContext)

  const { paused } = useContext(GeneralContext)

  const [retryAttempts, setRetryAttempts] = useState(0)
  const [alreadyExecuted, setAlreadyExecuted] = useState(false)
  const [genericChainData, setGenericChainData] = useState({})
  const [storedChainId, setStoredChainId] = useState(null)
  
  const [external20ChainData, setExternal20ChainData] = useState({})
  const [fetching20s, setFetching20s] = useState(null)
  
  const [external721ChainData, setExternal721ChainData] = useState({})
  const [fetching721s, setFetching721s] = useState(null)




  useEffect(() => {
    const owner = poolData?.daiPool?.owner
    if (!owner) {
      setRetryAttempts(retryAttempts + 1)
    }
  }, [poolData])

  // Forget wallet and releoad -  this typically happens when the Graph URI is out of sync with Onboard JS's chainId
  useEffect(() => {
    // console.log({ retryAttempts})
    if (retryAttempts > 12) {
      disconnectWallet()
      window.location.reload()
    }
  }, [retryAttempts])
  

  const _fetchDataFromInfura = async () => {
    const chainData = {
      dai: {},
    }

    chainData.dai = await fetchGenericChainData(
      provider,
      poolData.daiPool
    )
    
    return chainData
  }

  const _fetch20sFromInfura = async () => {
    const chainData = {
      dai: {},
    }

    if (
      isEmpty(external20ChainData) &&
      !fetching20s
    ) {
      setFetching20s(true)
      chainData.dai = await fetchExternalErc20Awards(
        provider,
        graphExternalErc20Awards,
        poolData.daiPool,
        coingeckoData
      )
      setFetching20s(false)
    }

    return chainData
  }
  
  const _fetch721sFromInfura = async () => {
    const chainData = {
      dai: {},
    }

    if (
      isEmpty(external721ChainData) &&
      !fetching721s
    ) {
      setFetching721s(true)
      chainData.dai = await fetchExternalErc721Awards(
        provider,
        dynamicExternalAwardsData.daiPool,
        poolData.daiPool,
      )
      setFetching721s(false)
    }

    return chainData
  }

  const _resetGenericChainData = () => {
    if (chainId !== storedChainId) {
      setAlreadyExecuted(false)
      setStoredChainId(chainId)
      setRetryAttempts(0)
    }
  }

  const _get20ChainDataAsync = async () => {
    const _result = await _fetch20sFromInfura()

    setExternal20ChainData(
      _result
    )
  }

  const _get721ChainDataAsync = async () => {
    const _result = await _fetch721sFromInfura()

    setExternal721ChainData(
      _result
    )
  }
  
  const _getChainDataAsync = async () => {
    const genericData = await _fetchDataFromInfura()
    setGenericChainData(genericData)
  }

  const _conditionallyGetChainData = async () => {
    const genericData = await _fetchDataFromInfura()

    // TODO: Looks like this DOESN'T support multiple pools as Dai is hard-coded here ...
    //
    if (isEmpty(genericData.dai)) {
      // this happens when switching networks:
      setAlreadyExecuted(false)
    } else {
      setGenericChainData(genericData)
    }
  }

  useInterval(() => {
    debug('fetching new chain data after MAINNET_POLLING_INTERVAL expired', MAINNET_POLLING_INTERVAL)
    _getChainDataAsync()
  }, paused ? null : MAINNET_POLLING_INTERVAL)

  useEffect(() => {
    if (!isEmpty(coingeckoData) && !genericChainData.dai) {
      debug(coingeckoData)
      debug('fetching new chain data since we now have coingecko price data')
      _getChainDataAsync()
    }
  }, [coingeckoData])



  // This only runs once when the component is mounted or when we reset the
  // `alreadyExecuted` state var if the user changes network, etc
  useEffect(() => {
    const ready = !isEmpty(provider) &&
      !isEmpty(poolData.daiPool) &&
      !isEmpty(dynamicExternalAwardsData?.daiPool)

    if (!alreadyExecuted && ready) {
      setAlreadyExecuted(true)
      _conditionallyGetChainData()
      _get20ChainDataAsync()
      _get721ChainDataAsync()
    }
  }, [provider, chainId, poolData])

  useEffect(() => {
    _resetGenericChainData()
  }, [chainId])

  return children({ 
    genericChainData,
    external20ChainData,
    external721ChainData,
  })
}
