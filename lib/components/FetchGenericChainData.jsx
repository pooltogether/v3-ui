import { useContext, useEffect, useState } from 'react'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchGenericChainData } from 'lib/utils/fetchGenericChainData'
import { fetchExternalErc721Awards } from 'lib/utils/fetchExternalErc721Awards'

const COINGECKO_LAMBDA_PATH = `/.netlify/functions/coingecko-price-api`

const debug = require('debug')('pool-app:FetchGenericChainData')

export const FetchGenericChainData = (props) => {
  const {
    chainId,
    children,
    dynamicExternalAwardsData,
    provider,
    poolData,
    graphDataLoading,
  } = props

  const { disconnectWallet } = useContext(WalletContext)

  const { paused } = useContext(GeneralContext)

  const [retryAttempts, setRetryAttempts] = useState(0)
  const [alreadyExecuted, setAlreadyExecuted] = useState(false)
  const [genericChainData, setGenericChainData] = useState({})
  const [storedChainId, setStoredChainId] = useState(null)
  
  const [cachedCoingeckoData, setCachedCoingeckoData] = useState(null)
  const [fetchingCoingeckoData, setFetchingCoingeckoData] = useState(null)
  
  const [external721ChainData, setExternal721ChainData] = useState({})
  const [fetching721s, setFetching721s] = useState(null)



  const externalErc20Awards = dynamicExternalAwardsData?.daiPool?.externalErc20Awards

  const _getCoingeckoData = async () => {
    if (fetchingCoingeckoData) {
      return
    }

    setFetchingCoingeckoData(true)

    try {
      const addressesString = externalErc20Awards.map(award => award.address).join(',')
      const postData = {
        addressesString
      }

      const response = await fetch(COINGECKO_LAMBDA_PATH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      setCachedCoingeckoData(await response.json())
    } catch (error) {
      console.error(error)
    } finally {
      const COINGECKO_POLL_INTERVAL = 60000
      setTimeout(() => {
        setFetchingCoingeckoData(false)
      }, COINGECKO_POLL_INTERVAL)
    }
  }
  debug(cachedCoingeckoData)

  useInterval(() => {
    if (!isEmpty(externalErc20Awards)) {
      _getCoingeckoData()
    }
  }, MAINNET_POLLING_INTERVAL)

  useEffect(() => {
    if (!isEmpty(externalErc20Awards)) {
      _getCoingeckoData()
    }
  }, [externalErc20Awards])











  useEffect(() => {
    const owner = poolData?.daiPool?.owner
    if (!owner) {
      setRetryAttempts(retryAttempts + 1)
    }
  }, [poolData])

  // major meltdown, this typically happens when the Graph URI is out of sync with Onboard JS's chainId
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
      // usdt: {},
    }

    try {
      chainData.dai = await fetchGenericChainData(
        provider,
        dynamicExternalAwardsData.daiPool,
        poolData.daiPool,
        cachedCoingeckoData
      )
      // chainData.usdt = await fetchGenericChainData(
      //   provider,
      //   poolAddresses.usdtPrizeStrategy,
      //   poolData.usdtPool
      // )
    } catch (e) {
      console.warn(e)
    } finally {
      return chainData
    }
  }
  
  const _fetch721sFromInfura = async () => {
    const chainData = {
      dai: {},
      // usdt: {},
    }

    try {
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
    } catch (e) {
      console.warn(e)
    } finally {
      return chainData
    }
  }

  const _resetGenericChainData = () => {
    if (chainId !== storedChainId) {
      setAlreadyExecuted(false)
      setStoredChainId(chainId)
      setRetryAttempts(0)
    }
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
    if (isEmpty(genericData.dai)) {
      // console.log('NO HIT, resetting ....')
      setAlreadyExecuted(false)
    } else if (!isEmpty(genericData.dai)) {
      // console.log('got data!')
      setGenericChainData(genericData)
    }
  }

  useInterval(() => {
    debug('fetching new chain data after MAINNET_POLLING_INTERVAL expired', MAINNET_POLLING_INTERVAL)
    _getChainDataAsync()
  }, paused ? null : MAINNET_POLLING_INTERVAL)


  useEffect(() => {
    // debug('fetching new chain data since we now have coingecko price data')
    _getChainDataAsync()
  }, [])

  useEffect(() => {
    if (!isEmpty(cachedCoingeckoData) && !genericChainData.dai) {
      debug('fetching new chain data since we now have coingecko price data')
      _getChainDataAsync()
    }
  }, [cachedCoingeckoData])



  // This only runs once when the component is mounted or when we reset the
  // `alreadyExecuted` state var if the user changes network, etc
  useEffect(() => {
    const ready = !isEmpty(provider) &&
      !isEmpty(poolData.daiPool) &&
      !isEmpty(dynamicExternalAwardsData?.daiPool)

    if (!alreadyExecuted && ready) {
      // console.log('ready and trying')
      setAlreadyExecuted(true)
      _conditionallyGetChainData()
      _get721ChainDataAsync()
    }
  }, [provider, chainId, poolData])

  useEffect(() => {
    _resetGenericChainData()
  }, [chainId])



  return children({ 
    coingeckoData: cachedCoingeckoData,
    genericChainData,
    external721ChainData
  })
}
