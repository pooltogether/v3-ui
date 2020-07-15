import { useEffect, useState } from 'react'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchGenericChainData } from 'lib/utils/fetchGenericChainData'

export const FetchGenericChainData = (props) => {
  const {
    children,
    pool,
    provider,
  } = props

  const poolAddress = pool && pool.id

  const [genericChainData, setGenericChainData] = useState({
    // underlyingCollateralSymbol: 'TOKEN',
    // poolTotalSupply: '1234',
  })

  const fetchDataFromInfura = async () => {
    try {
      const data = await fetchGenericChainData(
        provider,
        pool,
      )

      return data
    } catch (e) {
      // error while fetching from infura?
      return {}
    }
  }

  const updateGenericChainData = (genericData) => {
    setGenericChainData(existingData => ({
      ...existingData,
      ...genericData,
    }))
  }

  const updateOrDelete = async () => {
    if (poolAddress) {
      const genericData = await fetchDataFromInfura()
      // setGenericChainData(genericData)
      updateGenericChainData(genericData)
    } else {
      setGenericChainData({})
    }
  }

  useInterval(() => {
    // console.log('interval updateOrDelete')
    updateOrDelete()
    // if (pool) {
    //   const genericData = await fetchDataFromInfura()
    //   updateGenericChainData(genericData)
    // }
  }, MAINNET_POLLING_INTERVAL)

  useEffect(() => {
    // console.log('pool address change updateOrDelete')
    updateOrDelete()
    // OPTIMIZE: Could reset the interval loop here since we just grabbed fresh data!
  }, [poolAddress])

  return children({ genericChainData })
}
