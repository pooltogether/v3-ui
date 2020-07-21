import { useEffect, useState } from 'react'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchUsersChainData } from 'lib/utils/fetchUsersChainData'

export const FetchUsersChainData = (props) => {
  const {
    children,
    pool,
    provider,
    usersAddress,
  } = props

  const poolAddress = pool && pool.id

  const [usersChainData, setUsersChainData] = useState({})

  const fetchUsersDataFromInfura = async () => {
    try {
      const data = await fetchUsersChainData(
        provider,
        pool,
        usersAddress,
      )

      return data
    } catch (e) {
      // error while fetching from infura?
      return {}
    }
  }

  const updateOrDelete = async () => {
    if (poolAddress && usersAddress) {
      const usersData = await fetchUsersDataFromInfura()
      setUsersChainData(usersData)
    } else {
      setUsersChainData({})
    }
  }


  useInterval(() => {
    updateOrDelete()
  }, MAINNET_POLLING_INTERVAL)

  useEffect(() => {    
    updateOrDelete()
    // OPTIMIZE: Could reset the interval loop here since we just grabbed fresh data!
  }, [poolAddress])

  return children({ usersChainData })
}
