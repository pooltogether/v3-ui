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

  const [usersChainData, setUsersChainData] = useState({
    // tokenSymbol: 'TOKEN',
    // poolTotalSupply: '1234',
  })

  const fetchUsersDataFromInfura = async () => {
    try {
      const data = await fetchUsersChainData(
        provider,
        pool,
        usersAddress,
      )

      // console.log('***********************************')
      // console.log('run fetch users')
      // console.log({ data })
      // console.log('usersTokenAllowance', data.usersTokenAllowance)
      // if (data.usersTokenAllowance) {
      //   console.log('usersTokenAllowance toS', data.usersTokenAllowance.toString())
      // }
      // console.log('***********************************')

      return data
    } catch (e) {
      // error while fetching from infura?
      return {}
    }
  }

  const updateUsersChainData = (usersData) => {
    setUsersChainData(existingData => ({
      ...existingData,
      ...usersData,
    }))
  }

  useInterval(() => {
    if (poolAddress && usersAddress) {
      const usersData = fetchUsersDataFromInfura()
      updateUsersChainData(usersData)
    }
  }, MAINNET_POLLING_INTERVAL)

  useEffect(() => {
    const updateOrDelete = async () => {
      if (poolAddress && usersAddress) {
        const usersData = await fetchUsersDataFromInfura()
        console.log('SETTING USERS CHAIN DATA ! ')
        console.log({ usersChainData })
        setUsersChainData(usersData)
      } else {
        console.log('DELETING USERS DATA HERE !')
        setUsersChainData({})
      }
    }
    updateOrDelete()
  }, [poolAddress])

  return children({ usersChainData })
}
