import { useContext, useEffect, useState } from 'react'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchGenericChainData } from 'lib/utils/fetchGenericChainData'
import { isEmptyObject } from 'lib/utils/isEmptyObject'

const debug = require('debug')('pool-app:FetchGenericChainData')

export const FetchGenericChainData = (props) => {
  const {
    chainId,
    children,
    provider,
    poolAddresses,
    poolData,
  } = props

  const { paused } = useContext(GeneralContext)

  const [alreadyExecuted, setAlreadyExecuted] = useState(false)
  const [genericChainData, setGenericChainData] = useState({})
  const [storedChainId, setStoredChainId] = useState(null)

  const fetchDataFromInfura = async () => {
    const chainData = {
      daiPrizeStrategy: {},
      usdcPrizeStrategy: {},
      usdtPrizeStrategy: {},
      // wbtcPrizeStrategy: {},
      // zrxPrizeStrategy: {},
      // batPrizeStrategy: {},
    }

    try {
      chainData.daiPrizeStrategy = await fetchGenericChainData(
        provider,
        poolAddresses['daiPrizeStrategy'],
        poolData.daiPool
      )
      chainData.usdcPrizeStrategy = await fetchGenericChainData(
        provider,
        poolAddresses['usdcPrizeStrategy'],
        poolData.usdcPool
      )
      chainData.usdtPrizeStrategy = await fetchGenericChainData(
        provider,
        poolAddresses['usdtPrizeStrategy'],
        poolData.usdtPool
      )
      // chainData.wbtcPrizeStrategy = await fetchGenericChainData(
      //   provider,
      //   poolAddresses['wbtcPrizeStrategy'],
      //   poolData.wbtcPool
      // )
      // chainData.zrxPrizeStrategy = await fetchGenericChainData(
      //   provider,
      //   poolAddresses['zrxPrizeStrategy'],
      //   poolData.zrxPool
      // )
      // chainData.batPrizeStrategy = await fetchGenericChainData(
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

      if (isEmptyObject(genericData.daiPrizeStrategy)) {
        // console.log('NO HIT, resetting ....')
        setAlreadyExecuted(false)
      } else if (!isEmptyObject(genericData.daiPrizeStrategy)) {
        // console.log('got data!')
        setGenericChainData(genericData)
      }
    }

    const ready = !isEmptyObject(provider) && !isEmptyObject(poolData.daiPool)

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
      }
    }

    resetGenericChainData()
  }, [chainId])

  return children({ genericChainData })
}
