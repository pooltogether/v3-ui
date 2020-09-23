import { useContext, useEffect, useState } from 'react'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchGenericChainData } from 'lib/utils/fetchGenericChainData'
import { isEmptyObject } from 'lib/utils/isEmptyObject'

export const FetchGenericChainData = (props) => {
  const {
    chainId,
    children,
    provider,
    poolAddresses,
    poolData,
  } = props

  const { paused } = useContext(GeneralContext)

  const [genericChainData, setGenericChainData] = useState({})

  const fetchDataFromInfura = async () => {
    const chainData = {
      daiPrizeStrategy: {},
      usdcPrizeStrategy: {},
      // usdtPrizeStrategy: {},
      // wbtcPrizeStrategy: {},
    }
    try {
      if (!isEmpty(poolAddresses)) {
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
        // chainData.usdtPrizeStrategy = await fetchGenericChainData(
        //   provider,
        //   poolAddresses['usdtPrizeStrategy']
        // )
        // chainData.wbtcPrizeStrategy = await fetchGenericChainData(
        //   provider,
        //   poolAddresses['wbtcPrizeStrategy']
        // )
      }
    }
    catch (e) {
      console.warn(e)
    }
    finally {
      return chainData
    }
  }

  const updateOrDelete = async () => {
    const genericData = await fetchDataFromInfura()
    setGenericChainData(genericData)
  }

  useInterval(() => {
    if (!isEmptyObject(provider)) {
      updateOrDelete()
    }
  }, paused ? null : MAINNET_POLLING_INTERVAL)

  useEffect(() => {
    if (!isEmptyObject(provider)) {
      updateOrDelete()
    }

    // OPTIMIZE: Could reset the interval loop here
    // since we just grabbed fresh data!
  }, [provider, chainId])

  return children({ genericChainData })
}
