import { useContext, useEffect, useState } from 'react'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchGenericChainData } from 'lib/utils/fetchGenericChainData'

const debug = require('debug')('pool-app:FetchGenericChainData')

export const FetchGenericChainData = (props) => {
  const {
    chainId,
    children,
    provider,
    poolData,
    graphDataLoading,
  } = props

  const { disconnectWallet } = useContext(WalletContext)

  const { paused } = useContext(GeneralContext)

  const [retryAttempts, setRetryAttempts] = useState(0)

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
  

  const [alreadyExecuted, setAlreadyExecuted] = useState(false)
  const [genericChainData, setGenericChainData] = useState({})
  const [storedChainId, setStoredChainId] = useState(null)

  const fetchDataFromInfura = async () => {
    const chainData = {
      dai: {},
      // usdc: {},
      // usdt: {},
      // wbtc: {},
      // zrx: {},
      // bat: {},
    }

    try {
      chainData.dai = await fetchGenericChainData(
        provider,
        poolData.daiPool
      )
      // chainData.usdc = await fetchGenericChainData(
      //   provider,
      //   poolData.usdcPool
      // )
      // chainData.usdt = await fetchGenericChainData(
      //   provider,
      //   poolAddresses.usdtPrizeStrategy,
      //   poolData.usdtPool
      // )
      // chainData.wbtc = await fetchGenericChainData(
      //   provider,
      //   poolAddresses['wbtcPrizeStrategy'],
      //   poolData.wbtcPool
      // )
      // chainData.zrx = await fetchGenericChainData(
      //   provider,
      //   poolAddresses['zrxPrizeStrategy'],
      //   poolData.zrxPool
      // )
      // chainData.bat = await fetchGenericChainData(
      //   provider,
      //   poolAddresses['batPrizeStrategy'],
      //   poolData.batPool
      // )
    }
    catch (e) {
      console.warn(e)
    }
    finally {
      return chainData
    }
  }

  useInterval(() => {
    const getChainDataAsync = async () => {
      debug('fetching new chain data after MAINNET_POLLING_INTERVAL expired', MAINNET_POLLING_INTERVAL)
      const genericData = await fetchDataFromInfura()
      setGenericChainData(genericData)
    }

    getChainDataAsync()
  }, paused ? null : MAINNET_POLLING_INTERVAL)

  // This only runs once when the component is mounted or when we reset the
  // `alreadyExecuted` state var if the user changes network, etc
  useEffect(() => {
    const conditionallyGetChainData = async () => {
      const genericData = await fetchDataFromInfura()

      // console.log(genericData)

      if (isEmpty(genericData.dai)) {
        // console.log('NO HIT, resetting ....')
        setAlreadyExecuted(false)
      } else if (!isEmpty(genericData.dai)) {
        // console.log('got data!')
        setGenericChainData(genericData)
      }
    }

    const ready = !isEmpty(provider) && !isEmpty(poolData.daiPool)

    if (!alreadyExecuted && ready) {
      // console.log('ready and trying')
      setAlreadyExecuted(true)
      conditionallyGetChainData()
    }
  }, [provider, chainId, poolData])

  useEffect(() => {
    const resetGenericChainData = () => {
      if (chainId !== storedChainId) {
        setAlreadyExecuted(false)
        setStoredChainId(chainId)
        setRetryAttempts(0)
      }
    }

    resetGenericChainData()
  }, [chainId])

  return children({ genericChainData })
}
