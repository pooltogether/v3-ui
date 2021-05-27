import { useState } from 'react'
import { ethers } from 'ethers'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { fetchExitFees } from 'lib/utils/fetchExitFees'
import { useReadProvider } from 'lib/hooks/providers/useReadProvider'
import { useUsersAddress } from '@pooltogether/hooks'
import { useQuery } from 'react-query'
import { QUERY_KEYS } from 'lib/constants/queryKeys'

export function useExitFees(chainId, poolAddress, ticketAddress, ticketDecimals, quantity) {
  const usersAddress = useUsersAddress()

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

      return response
    }
  }

  const { data: exitFees } = useQuery(
    [QUERY_KEYS.getExitFees, ready, quantity, usersAddress, chainId, ticketAddress, poolAddress],
    () => getFees(),
    { refetchInterval: MAINNET_POLLING_INTERVAL }
  )

  return { exitFees: exitFees || {} }
}
