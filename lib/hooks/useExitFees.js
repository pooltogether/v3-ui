import { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { fetchExitFees } from 'lib/utils/fetchExitFees'
import { useInterval } from 'lib/hooks/useInterval'

export function useExitFees(quantity) {
  const { pauseQueries, usersAddress, networkName } = useContext(AuthControllerContext)
  const { pool } = useContext(PoolDataContext)

  const poolAddress = pool?.poolAddress
  const ticketAddress = pool?.ticketToken?.id

  const [exitFees, setExitFees] = useState({})
 
  let underlyingCollateralDecimals = 18
  underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals

  const getFees = async () => {
    const quantityBN = ethers.utils.parseUnits(
      quantity,
      Number(underlyingCollateralDecimals)
    )

    const response = await fetchExitFees(
      networkName,
      usersAddress,
      poolAddress,
      ticketAddress,
      quantityBN
    )

    setExitFees(response)
  }

  useInterval(() => {
    getFees()
  }, pauseQueries ? null : MAINNET_POLLING_INTERVAL)

  useEffect(() => {
    const ready = quantity && usersAddress && networkName && ticketAddress && poolAddress && networkName
    if (ready) {
      getFees()
    }
    // OPTIMIZE: Could reset the interval loop here since we just grabbed fresh data!
  }, [
    quantity,
    usersAddress,
    networkName,
    ticketAddress,
    poolAddress,
    networkName
  ])
  
  return { exitFees }
}
