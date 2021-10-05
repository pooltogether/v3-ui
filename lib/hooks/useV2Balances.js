import { useIsTestnets } from '@pooltogether/hooks'
import { NETWORK } from '@pooltogether/utilities'

import { V2_POOLS } from 'lib/constants'
import { useTokenBalances } from 'lib/hooks/useTokenBalances'

export const useV2Balances = (usersAddress) => {
  const { isTestnets } = useIsTestnets()
  const addresses = isTestnets ? [] : V2_POOLS.map((pool) => pool.ticket.address)

  const { data: balances, ...useTokenBalancesResponse } = useTokenBalances(
    NETWORK.mainnet,
    usersAddress,
    addresses
  )

  const data = balances
    ? Object.keys(balances).map((ticketAddress) => ({
        ...balances[ticketAddress],
        ...V2_POOLS.find((pool) => pool.ticket.address === ticketAddress)
      }))
    : null

  return { ...useTokenBalancesResponse, data }
}
