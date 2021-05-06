import { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { fetchExitFees } from 'lib/utils/fetchExitFees'
import { useInterval } from 'lib/hooks/useInterval'
import { useReadProvider } from 'lib/hooks/providers/useReadProvider'

export function useExitFees(chainId, poolAddress, ticketAddress, ticketDecimals, quantity) {
  const { pauseQueries, usersAddress } = useContext(AuthControllerContext)

  const [exitFees, setExitFees] = useState({})
  const { data: readProvider, isFetched: isReadProviderReady } = useReadProvider(chainId)

  const ready =
    quantity && usersAddress && chainId && ticketAddress && poolAddress && isReadProviderReady

  const getFees = async () => {
    if (ready) {
      const quantityBN = ethers.utils.parseUnits(quantity, ticketDecimals)

      const response = await fetchExitFees(
        readProvider,
        usersAddress,
        poolAddress,
        ticketAddress,
        quantityBN
      )

      setExitFees(response)
    }
  }

  // This should use react-query so it can handle if the browser is in focus or not
  useInterval(
    () => {
      getFees()
    },
    pauseQueries ? null : MAINNET_POLLING_INTERVAL
  )

  useEffect(() => {
    getFees()
    // OPTIMIZE: Could reset the interval loop here since we just grabbed fresh data!
  }, [quantity, usersAddress, chainId, ticketAddress, poolAddress])

  return { exitFees }
}
