import { useEffect, useState } from 'react'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchGenericChainData } from 'lib/utils/fetchChainData'

export const FetchGenericChainData = (props) => {
  const {
    pool,
    networkName,
  } = props

  const poolAddress = pool && pool.id
  console.log({ poolAddress})

  const [genericChainData, setGenericChainData] = useState({
    loading: true,
    // tokenSymbol: 'TOKEN',
    // poolTotalSupply: '1234',
  })

  const fetchDataFromInfura = () => {
    console.log('run fetch generic')
    return fetchGenericChainData(
      networkName,
      pool,
    )
  }

  const updateGenericChainData = (genericData) => {
    setGenericChainData(existingData => ({
      ...existingData,
      ...genericData,
      loading: false,
    }))
  }

  useInterval(() => {
    if (pool) {
      const genericData = fetchDataFromInfura()
      updateGenericChainData(genericData)
    }
  }, MAINNET_POLLING_INTERVAL)

  useEffect(() => {
    if (poolAddress && genericChainData.loading) {
      console.log('pool is: ', pool)
      console.log('genericChainData.loading is: ', genericChainData.loading)
      const genericData = fetchInfura()
      setGenericChainData(genericData)
    } else {
      console.log(' COULD DELETE DATA HERE ! ')
      setGenericChainData({
        loading: true,
      })
    }
  }, [poolAddress])

  return children({ genericChainData, loading })
}
