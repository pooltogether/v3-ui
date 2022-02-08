import { ethers } from 'ethers'
import { useReadProvider } from '@pooltogether/hooks'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { fetchExitFees } from 'lib/utils/fetchExitFees'
import { QUERY_KEYS } from 'lib/constants/queryKeys'

export function useExitFees(chainId, poolAddress, ticketAddress, ticketDecimals, quantity) {
  const { address: usersAddress } = useOnboard()

  const readProvider = useReadProvider(chainId)

  const enabled = Boolean(
    quantity && usersAddress && chainId && ticketAddress && poolAddress && !!readProvider
  )

  const { data: exitFees } = useQuery(
    [QUERY_KEYS.getExitFees, enabled, quantity, usersAddress, chainId, ticketAddress, poolAddress],
    () => getFees(quantity, ticketDecimals, readProvider, usersAddress, poolAddress, ticketAddress),
    { refetchInterval: MAINNET_POLLING_INTERVAL, enabled }
  )

  return { exitFees: exitFees || {} }
}

const getFees = async (
  quantity,
  ticketDecimals,
  readProvider,
  usersAddress,
  poolAddress,
  ticketAddress
) => {
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
