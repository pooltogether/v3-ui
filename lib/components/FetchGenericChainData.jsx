import { useEffect, useState } from 'react'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchGenericChainData } from 'lib/utils/fetchGenericChainData'
import { isEmptyObject } from 'lib/utils/isEmptyObject'

export const FetchGenericChainData = (props) => {
  const {
    chainId,
    children,
    provider,
    poolAddresses,
  } = props

  const [genericChainData, setGenericChainData] = useState({})

  const fetchDataFromInfura = async () => {
    try {
      const daiPrizeStrategy = await fetchGenericChainData(
        provider,
        poolAddresses['daiPrizeStrategy']
      )
      const usdcPrizeStrategy = await fetchGenericChainData(
        provider,
        poolAddresses['usdcPrizeStrategy']
      )
      const usdtPrizeStrategy = await fetchGenericChainData(
        provider,
        poolAddresses['usdtPrizeStrategy']
      )

      return {
        daiPrizeStrategy,
        usdcPrizeStrategy,
        usdtPrizeStrategy,
      }
    } catch (e) {
      // error while fetching from infura?
      console.warn(e)
      return {}
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
  }, MAINNET_POLLING_INTERVAL)

  useEffect(() => {
    if (!isEmptyObject(provider)) {
      updateOrDelete()
    }

    // OPTIMIZE: Could reset the interval loop here
    // since we just grabbed fresh data!
  }, [provider, chainId])

  return children({ genericChainData })
}
