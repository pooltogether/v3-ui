import { APP_ENVIRONMENT, useAppEnv } from '@pooltogether/hooks'
import { NETWORK } from '@pooltogether/utilities'

import { V2_POOLS } from 'lib/constants'
import { useTokenBalances } from 'lib/hooks/useTokenBalances'

export const useV2Balances = (usersAddress) => {
  const { appEnv } = useAppEnv()
  const addresses =
    appEnv === APP_ENVIRONMENT.mainnets ? V2_POOLS.map((pool) => pool.ticket.address) : []
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
