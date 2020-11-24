import { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { fetchExitFees } from 'lib/utils/fetchExitFees'
import { useInterval } from 'lib/hooks/useInterval'

export function useExitFees(quantity) {
  const { paused } = useContext(GeneralContext)
  const { usersAddress, networkName } = useContext(AuthControllerContext)
  const { pool } = useContext(PoolDataContext)

  const poolAddress = pool?.poolAddress
  const ticketAddress = pool?.prizeStrategy?.singleRandomWinner?.ticket?.id

  const [exitFees, setExitFees] = useState({})
 
  let underlyingCollateralDecimals = 18
  underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals

  const getFees = async () => {
    const quantityBN = ethers.utils.parseUnits(
      quantity,
      Number(underlyingCollateralDecimals)
    )

    const result = await fetchExitFees(
      networkName,
      usersAddress,
      poolAddress,
      ticketAddress,
      quantityBN
    )

    setExitFees(result)
  }

  useInterval(() => {
    getFees()
  }, paused ? null : MAINNET_POLLING_INTERVAL)

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
