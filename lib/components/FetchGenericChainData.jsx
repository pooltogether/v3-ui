import { useContext, useEffect, useState } from 'react'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchGenericChainData } from 'lib/utils/fetchGenericChainData'

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
  





  const externalErc20Awards = dynamicExternalAwardsData?.daiPool?.externalErc20Awards

  const _getCoingeckoData = async () => {
    // console.log(externalErc20Awards)

    try {
      const addressesString = externalErc20Awards.map(award => award.address).join(',')
      const postData = {
        addressesString
      }
      // debug({ addressesString })
      // console.log({ addressesString })

      const response = await fetch(COINGECKO_LAMBDA_PATH, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData) // body data type must match "Content-Type" header
      })

      setCachedCoingeckoData(await response.json())
    } catch (error) {
      console.error(error)
    }
  }
  // console.log(cachedCoingeckoData)

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
    }
    catch (e) {
      console.warn(e)
    }
    finally {
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

  // useEffect(() => {
  //   if (isEmpty(cachedCoingeckoData)) {
  //     debug('fetching new chain data since we now have coingecko price data')
  //     _getChainDataAsync()
  //   }

  //   setCachedCoingeckoData(coingeckoData)
  // }, [coingeckoData])

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
    }
  }, [provider, chainId, poolData])

  useEffect(() => {
    _resetGenericChainData()
  }, [chainId])

  return children({ 
    coingeckoData: cachedCoingeckoData,
    genericChainData
  })
}
