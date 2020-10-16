import { useContext, useEffect, useState } from 'react'
import { uniqWith, isEqual } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchUsersChainData } from 'lib/utils/fetchUsersChainData'

const debug = require('debug')('pool-app:FetchUsersChainData')

export const FetchUsersChainData = (props) => {
  const {
    children,
    graphDripData,
    pool,
    provider,
    usersAddress,
  } = props

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const poolAddress = pool?.poolAddress

  const [usersChainData, setUsersChainData] = useState({})

  let pairs = []
  let dripTokens = []
  let comptrollerAddress
  if (graphDripData?.balanceDrips) {
    const balanceDripPairs = graphDripData?.balanceDrips.map((drip) => [drip.sourceAddress, drip.measureToken])
    const volumeDripPairs = graphDripData?.volumeDrips.map((drip) => [drip.sourceAddress, drip.measureToken])

    pairs = uniqWith(balanceDripPairs?.concat(volumeDripPairs), isEqual)

    const balanceDripTokens = graphDripData?.balanceDrips.map((drip) => drip.dripToken)
    const volumeDripTokens = graphDripData?.volumeDrips.map((drip) => drip.dripToken)

    dripTokens = uniqWith(balanceDripTokens?.concat(volumeDripTokens), isEqual)

    comptrollerAddress = graphDripData?.balanceDrips?.[0].comptroller.id
  }

  const fetchUsersDataFromInfura = async () => {
    try {
      const data = await fetchUsersChainData(
        provider,
        pool,
        comptrollerAddress,
        dripTokens,
        usersAddress,
        pairs,
      )

      return data
    } catch (e) {
      // error while fetching from infura?
      console.warn(e)
      return {}
    }
  }

  const updateOrDelete = async () => {
    if (usersAddress) {
      const usersData = await fetchUsersDataFromInfura()
      setUsersChainData(usersData)
    } else {
      setUsersChainData({})
    }
  }


  useInterval(() => {
    debug('fetching new users chain data after MAINNET_POLLING_INTERVAL expired', MAINNET_POLLING_INTERVAL)
    updateOrDelete()
  }, paused ? null : MAINNET_POLLING_INTERVAL)

  useEffect(() => {
    updateOrDelete()
    // OPTIMIZE: Could reset the interval loop here since we just grabbed fresh data!
  }, [poolAddress, usersAddress, comptrollerAddress])

  return children({ usersChainData })
}
